# monitoring-grafana-prometheus-k6

## Description

A comprehensive monitoring and load testing solution built with Grafana, Prometheus, and k6. This project enables real-time metrics collection, performance analysis, and interactive visualization dashboards, helping to evaluate system health, detect issues, and measure application performance under load.

This project sets up a **complete observability and load testing environment** across two VMs:

- **VM1 (192.168.1.14)** → Runs the application and Node Exporter for system metrics.  
- **VM2 (192.168.1.13)** → Runs Prometheus, Grafana, InfluxDB, and k6 for monitoring and load testing.  

**Components:**

| Component       | Purpose |
|-----------------|---------|
| Node Exporter   | Collects system metrics (CPU, RAM, Disk) on VM1 |
| Application     | Runs the app under test on VM1 |
| Prometheus      | Scrapes metrics from VM1 |
| Grafana         | Visualizes metrics from Prometheus and InfluxDB |
| InfluxDB        | Stores k6 load testing results |
| k6              | Performs load testing on the application |

---

## 1. Pre-requisites

### 1.1 Docker & Docker Compose

Install Docker and Docker Compose on both VMs (Ubuntu/Debian):

```bash
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl enable docker
sudo systemctl start docker
docker --version
docker compose --version
````

### 1.2 Network Setup

* Both VMs should use a **Bridged Network** for direct communication.
* VM1 IP: `192.168.1.14`
* VM2 IP: `192.168.1.13`

Test connectivity from VM2:

```bash
ping 192.168.1.14
```

* Open required ports on VM1:

  * Node Exporter → `9100`
  * Application → `8082`

---

## 2. Directory Creation

### VM1

```bash
mkdir -p ~/node-exporter
mkdir -p ~/app
```

### VM2

```bash
mkdir -p ~/monitoring-stack/prometheus
mkdir -p ~/monitoring-stack/grafana/provisioning/datasources
mkdir -p ~/monitoring-stack/grafana/provisioning/dashboards
mkdir -p ~/monitoring-stack/k6/scripts
```

---

## 3. VM1 Setup

### 3.1 Node Exporter

* File: [node-exporter/docker-compose.yml](node-exporter/docker-compose.yml)

  > Docker Compose file for Node Exporter container exposing system metrics on port 9100.

Start Node Exporter:

```bash
cd ~/node-exporter
docker-compose up -d
curl http://192.168.1.14:9100/metrics
```

---

### 3.2 Application

* File: [app/docker-compose.yml](app/docker-compose.yml)

  > Docker Compose file to run the application on port 8082.

Start application:

```bash
cd ~/app
docker-compose up -d
curl http://192.168.1.14:8082
```

---

## 4. VM2 Setup

### 4.1 Monitoring Stack Docker Compose

* File: [monitoring-stack/docker-compose.yml](monitoring-stack/docker-compose.yml)

  > Starts Prometheus, Grafana, InfluxDB, and k6 with persistent volumes.

```bash
cd ~/monitoring-stack
docker-compose up -d
```

---

### 4.2 Prometheus Configuration

* File: [monitoring-stack/prometheus/prometheus.yml](monitoring-stack/prometheus/prometheus.yml)

  > Configures Prometheus to scrape metrics from VM1 Node Exporter and application.

---

### 4.3 Grafana Data Sources

* File: [monitoring-stack/grafana/provisioning/datasources/datasource.yml](monitoring-stack/grafana/provisioning/datasources/datasource.yml)

  > Defines Prometheus and InfluxDB as data sources in Grafana.

---

### 4.4 Grafana Dashboards

* File: [monitoring-stack/grafana/provisioning/dashboards/dashboard.yml](monitoring-stack/grafana/provisioning/dashboards/dashboard.yml)

  > Dashboard provider configuration for Grafana.

* File: [monitoring-stack/grafana/provisioning/dashboards/k6-dashboard.json](monitoring-stack/grafana/provisioning/dashboards/k6-dashboard.json)

  > JSON file containing k6 dashboards for load testing metrics.

> You can use the [official k6 Grafana dashboard](https://grafana.com/grafana/dashboards/2587) or a custom export.

---

### 4.5 k6 Load Test Script

* File: [monitoring-stack/k6/scripts/test.js](monitoring-stack/k6/scripts/test.js)

  > k6 script that performs load testing against the application and stores results in InfluxDB.

Run k6 test:

```bash
docker exec -it k6 k6 run --out influxdb=http://influxdb:8086/k6 /scripts/test.js
```

---

## 5. Accessing Services

| Service       | URL                                                  |
| ------------- | ---------------------------------------------------- |
| Prometheus    | [http://192.168.1.13:9090](http://192.168.1.13:9090) |
| Grafana       | [http://192.168.1.13:3000](http://192.168.1.13:3000) |
| InfluxDB      | [http://192.168.1.13:8086](http://192.168.1.13:8086) |
| Node Exporter | [http://192.168.1.14:9100](http://192.168.1.14:9100) |
| Application   | [http://192.168.1.14:8082](http://192.168.1.14:8082) |

---

## 6. Network / Firewall

Ensure VM2 can reach VM1 on ports:

* Node Exporter → `9100`
* Application → `8082`

Test connectivity:

```bash
curl http://192.168.1.14:9100/metrics
curl http://192.168.1.14:8082
```

---
