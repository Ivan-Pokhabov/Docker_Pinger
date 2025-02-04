package main

import (
	"encoding/json"
	"net/http"
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

func initDB() {
	db, _ = sqlx.Connect("pgx", dbConnStr)

	query := `CREATE TABLE IF NOT EXISTS pings (
		id SERIAL PRIMARY KEY,
		ip VARCHAR(50) NOT NULL,
		ping_time INT NOT NULL,
		last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)`
	db.Exec(query)
}

func getPingsHandler(w http.ResponseWriter, r *http.Request) {
	var results []PingResult
	err := db.Select(&results, "SELECT id, ip, ping_time, last_checked FROM pings ORDER BY last_checked DESC")
	if err != nil {
		http.Error(w, "Ошибка запроса к базе данных", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}

func addPingHandler(w http.ResponseWriter, r *http.Request) {
	var p PingResult
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, "Некорректные данные", http.StatusBadRequest)
		return
	}

	_, err := db.Exec("INSERT INTO pings (ip, ping_time, last_checked) VALUES ($1, $2, NOW())", p.IPAddress, p.PingTime)
	if err != nil {
		http.Error(w, "Ошибка записи в БД", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func main() {
	initDB()
	defer db.Close()

	r := mux.NewRouter()
	r.HandleFunc("/api/pings", getPingsHandler).Methods("GET")
	r.HandleFunc("/api/pings", addPingHandler).Methods("POST")

}
