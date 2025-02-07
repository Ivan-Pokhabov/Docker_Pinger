package main

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/cenkalti/backoff/v4"
	"github.com/prometheus-community/pro-bing"
)

const (
	apiBaseURL     = "http://server:4000/api"
	getContainers  = "/pings" 
	postPingResult = "/pings"
	logFile        = "pinger.log"
)

type Container struct {
	ID int    `json:"id"`
	IP string `json:"ip"`
}

type PingResult struct {
	ID          int       `json:"id"`
	IP   string    `json:"ip"`
	PingTime    int       `json:"ping_time"`
	LastChecked time.Time `json:"last_checked"`
}

func initLogger() {
	file, err := os.OpenFile(logFile, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Fatal("Ошибка открытия файла логов:", err)
	}
	log.SetOutput(file)
	log.Println("Pinger сервис запущен...")
}

func requestWithRetry(method, url string, body []byte) (*http.Response, error) {
	var resp *http.Response
	var err error

	operation := func() error {
		var req *http.Request
		if body != nil {
			req, err = http.NewRequest(method, url, bytes.NewBuffer(body))
			req.Header.Set("Content-Type", "application/json")
		} else {
			req, err = http.NewRequest(method, url, nil)
		}

		if err != nil {
			return err
		}

		client := &http.Client{Timeout: 5 * time.Second}
		resp, err = client.Do(req)
		if err != nil {
			log.Printf("Ошибка HTTP-запроса (%s): %v. Повтор...\n", url, err)
			return err
		}

		if resp.StatusCode >= 500 {
			log.Printf("Серверная ошибка (%s): %d. Повтор...\n", url, resp.StatusCode)
			return err
		}

		return nil
	}

	expBackoff := backoff.NewExponentialBackOff()
	expBackoff.MaxElapsedTime = 15 * time.Second

	err = backoff.Retry(operation, expBackoff)
	return resp, err
}

func fetchContainers() ([]Container, error) {
	resp, err := requestWithRetry("GET", apiBaseURL+getContainers, nil)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var containers []Container
	err = json.NewDecoder(resp.Body).Decode(&containers)
	if err != nil {
		return nil, err
	}

	return containers, nil
}

func sendPingResult(result PingResult) error {
	data, err := json.Marshal(result)
	if err != nil {
		return err
	}

	resp, err := requestWithRetry("POST", apiBaseURL+postPingResult, data)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		body := new(bytes.Buffer)
		body.ReadFrom(resp.Body)
		log.Printf("Ошибка отправки данных (HTTP %d): %s\n", resp.StatusCode, body.String())
		return err
	}

	log.Printf("Успешно отправлен результат пинга: %+v\n", result)
	return nil
}

func pingContainer(ip string) (int, error) {
	pinger, err := probing.NewPinger(ip)
	if err != nil {
		return 0, err
	}
	pinger.Count = 3
	pinger.Timeout = time.Second * 5
	pinger.SetPrivileged(true)

	err = pinger.Run()
	if err != nil {
		return 0, err
	}

	stats := pinger.Statistics()
	return int(stats.AvgRtt.Milliseconds()), nil
}

func pingAllContainers() {
	containers, err := fetchContainers()
	if err != nil {
		log.Println("Ошибка получения контейнеров:", err)
		return
	}

	for _, container := range containers {
		pingTime, err := pingContainer(container.IP)
		if err != nil {
			log.Printf("Ошибка пинга %s: %v\n", container.IP, err)
			continue
		}

		log.Printf("Пинг %s: %d ms\n", container.IP, pingTime)

		result := PingResult{
			IP:   container.IP,
			PingTime:    pingTime,
			LastChecked: time.Now(),
		}

		err = sendPingResult(result)
		if err != nil {
			log.Printf("Ошибка отправки данных о пинге %s: %v\n", container.IP, err)
		}
	}
}

func main() {
	initLogger()

	for {
		pingAllContainers()
		time.Sleep(10 * time.Second)
	}
}
