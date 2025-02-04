package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
	_ "github.com/jackc/pgx/v5/stdlib"
)

const (
	dbConnStr = "postgres://myuser:lolkek666@localhost:5432/pingdb?sslmode=disable"
	logFile   = "server.log"
)

var db *sqlx.DB

type PingResult struct {
	ID          int       `db:"id" json:"id"`
	IPAddress   string    `db:"ip"`
	PingTime    int       `db:"ping_time"`
	LastChecked time.Time `db:"last_checked"`
}

func initLogger() {
	file, err := os.OpenFile(logFile, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Fatal("Ошибка открытия файла логов:", err)
	}
	log.SetOutput(file)
	log.Println("Сервер запущен...")
}

func initDB() {
	var err error
	db, err = sqlx.Connect("pgx", dbConnStr)
	if err != nil {
		log.Fatal("Ошибка подключения к БД:", err)
	}

	query := `CREATE TABLE IF NOT EXISTS pings (
		id SERIAL PRIMARY KEY,
		ip VARCHAR(50) NOT NULL,
		ping_time INT NOT NULL,
		last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)`
	_, err = db.Exec(query)
	if err != nil {
		log.Fatal("Ошибка создания таблицы:", err)
	}
	log.Println("База данных успешно инициализирована.")
}

func getPingsHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("GET /api/pings запрошен")

	var results []PingResult
	err := db.Select(&results, "SELECT id, ip, ping_time, last_checked FROM pings ORDER BY last_checked DESC")
	if err != nil {
		log.Println("Ошибка запроса к БД:", err)
		http.Error(w, "Ошибка запроса к базе данных", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}

func addPingHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("POST /api/pings запрошен")

	var p PingResult
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		log.Println("Некорректные данные:", err)
		http.Error(w, "Некорректные данные", http.StatusBadRequest)
		return
	}

	_, err := db.Exec("INSERT INTO pings (ip, ping_time, last_checked) VALUES ($1, $2, NOW())", p.IPAddress, p.PingTime)
	if err != nil {
		log.Println("Ошибка записи в БД:", err)
		http.Error(w, "Ошибка записи в БД", http.StatusInternalServerError)
		return
	}

	log.Printf("Добавлена запись: IP=%s, PingTime=%d\n", p.IPAddress, p.PingTime)
	w.WriteHeader(http.StatusCreated)
}

func main() {
	initLogger()
	initDB()
	defer db.Close()

	r := mux.NewRouter()
	r.HandleFunc("/api/pings", getPingsHandler).Methods("GET")
	r.HandleFunc("/api/pings", addPingHandler).Methods("POST")

	log.Println("Сервер запущен на порту 4000")
	log.Fatal(http.ListenAndServe(":4000", r))
}
