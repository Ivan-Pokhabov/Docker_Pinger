# 🐳 Docker Pinger
📡 **Мониторинг состояния Docker-контейнеров с API, пингами и UI**  

## 📌 Описание  
Проект предназначен для **автоматического мониторинга Docker-контейнеров**.  
Он получает **IP контейнеров**, **пингует их**, **сохраняет данные в PostgreSQL** и предоставляет **веб-интерфейс** для просмотра состояния.  

---

## 🚀 Функциональность  
✔️ Получение **IP-адресов Docker-контейнеров**  
✔️ **Периодический пинг** контейнеров (через `pro-bing`)  
✔️ **Сохранение данных** (IP, время пинга, последняя проверка) в PostgreSQL  
✔️ **REST API (на Go, `gorilla/mux`)** для взаимодействия  
✔️ **Веб-интерфейс (React, Mantine UI)**  

---

## 🛠 Технологии  
- 🐹 **Backend**: Go (`gorilla/mux`, `sqlx`, `pgx`)  
- 🐳 **DB**: PostgreSQL  
- 🌐 **Frontend**: React + TypeScript + Mantine UI + nginx
- 📡 **Pinger**: `prometheus-community/pro-bing`  
- 🔄 **Логирование**: `log` + файлы логов  
- 🔄 **Ретраи API-запросов**: `cenkalti/backoff/v4`  

---

Все сервисы работают в Docker и управляются через **Docker Compose**.

---

## 🔧 Установка и запуск

### 1. Установите зависимости
Перед запуском убедитесь, что у вас установлены:
- **Docker** ([скачать](https://docs.docker.com/get-docker/))
- **Docker Compose** ([установка](https://docs.docker.com/compose/install/))

Проверьте их версии:
```sh
docker --version
docker compose version
```
### 2. Клонируйте репозиторий и перейдите в папку проекта
```sh
git clone https://github.com/
cd ...
```
### 3. Настройте переменные окружения
Создайте файл .env в папке pinger-site/ и добавьте API-URL:
```sh
echo "VITE_API_URL=http://localhost:4000" > pinger-site/.env
```
Если вы запускаете на каком-то домене место `localhost` используйте ваш `URL`
### 4. Соберите и запустите все сервисы
```sh
sudo docker compose up --build
```
После запуска сервисы будут доступны:

- Фронтенд (React) → http://localhost:3000
- Бэкенд (Go API) → http://localhost:4000
- База данных (PostgreSQL) → localhost:5432, логин: myuser, пароль: lolkek666
- ### 5. Проверьте, что сервисы работают
- Проверить запущенные контейнеры:
```sh
sudo docker ps
```
- Проверить API сервера:
```sh
curl http://localhost:4000/api/pings
```
- Проверить логи pinger:
```sh
sudo docker logs -f pinger
```
Вместо `pinger` название контейнера отвечающего за него.
- Зайти в базу данных и посмотреть записи:
```sh
sudo docker exec -it pingdb psql -U myuser -d pingdb
```
### 6. Как остановить сервисы
- Остановить все контейнеры:
```sh
sudo docker compose down
```
- Остановить с очисткой бд (данные будут удалены):
```sh
sudo docker compose down -v
```
## License

This project is licensed under the terms of the **MIT** license. See the [LICENSE](LICENSE) for more information.
