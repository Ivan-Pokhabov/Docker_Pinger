package main

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/go-ping/ping"
)

const (
	apiBaseURL     = "http://localhost:4000/api"
	getContainers  = "/containers"
	postPingResult = "/pings"
)

type Container struct {
	ID int    `json:"id"`
	IP string `json:"ip"`
}

type PingResult struct {
	ID          int       `json:"id"`
	IPAddress   string    `json:"ip"`
	PingTime    int       `json:"ping_time"`
	LastChecked time.Time `json:"last_checked"`
}

func fetchContainers() ([]Container, error) {
	resp, err := http.Get(apiBaseURL + getContainers)
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

	resp, err := http.Post(apiBaseURL+postPingResult, "application/json", bytes.NewBuffer(data))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		return err
	}

	return nil
}

func pingContainer(ip string) (int, error) {
	pinger, err := ping.NewPinger(ip)
	if err != nil {
		return 0, err
	}
	pinger.Count = 3
	pinger.Timeout = time.Second * 5

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

		result := PingResult{
			IPAddress:   container.IP,
			PingTime:    pingTime,
			LastChecked: time.Now(),
		}

		err = sendPingResult(result)
		if err != nil {
			log.Printf("Ошибка отправки данных о пинге %s: %v\n", container.IP, err)
		} else {
			log.Printf("Успешно отправлен результат пинга %s: %d ms\n", container.IP, pingTime)
		}
	}
}

func main() {
	for {
		pingAllContainers()
		time.Sleep(10 * time.Second)
	}
}
