# AGMS - Automated Gas Metering System

An enterprise-grade prepaid gas metering platform that enables real-time communication between smart gas meters, a Java Spring Boot API server, MySQL database, and a modern administrative & consumer web portal.

---

## Core System Modules

- **Simulated Smart Meter Engine (`/simulator`)**: Built-in interactive smart meter device simulator with dynamic gas burner flow control, motorized valve toggle, STS keypad token top-up, and real-time telemetry auto-sync. Eliminates the need for physical hardware or complex socket daemons during deployment.
- **Backend Options**:
  - **Native cPanel PHP REST API (`cpanel-api/`)**: Ultra-lightweight PHP backend designed for 1-click deployment on standard shared cPanel hosting with zero Java/daemon dependencies.
  - **Spring Boot REST API (`backend/`)**: Java 17 enterprise REST API with optional DLMS socket listener for VPS / dedicated environments.
- **Admin & Consumer Web Portal**: Built with TanStack Start, React 19, TypeScript, and Tailwind CSS. Features dynamic role-based navigation, empty-state guidance, and interactive modals.
- **Role-Based Access Control (RBAC)**: Supports **Super Admin**, **Field Engineer / Operator**, **Support Staff**, and **Consumer** accounts.

---

## Setup & Deployment Documentation

- 🚀 **Online cPanel Deployment (Recommended)**: Read [CPANEL_DEPLOYMENT_GUIDE.md](file:///c:/Users/DIDAR/Desktop/Sadika%20Versity%20Project/Automated%20Gas%20Meter%20Software/CPANEL_DEPLOYMENT_GUIDE.md) for 3-minute shared hosting deployment using PHP + MySQL + Simulated Meter.
- 💻 **Local Development Setup**: Read [XAMPP_SETUP_GUIDE.md](file:///c:/Users/DIDAR/Desktop/Sadika%20Versity%20Project/Automated%20Gas%20Meter%20Software/XAMPP_SETUP_GUIDE.md) to run MySQL, Spring Boot, and Vite locally.

---

## Pre-Configured Seed Logins

| Role | Username | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin` | `admin123` | Full system control, tariffs, users & fleet |
| **Field Engineer** | `engineer` | `engineer123` | Meter hardware, valve control, socket logs |
| **Support Staff** | `support` | `support123` | Customer registry, manual recharge issuance |
| **Consumer** | `consumer` | `consumer123` | Personal meter balance, usage, online recharge |

---

## Built With

- **Backend**: Java 17, Spring Boot 3.2, Hibernate / JPA, Gurux.DLMS 4.0, Spring Security (BCrypt)
- **Frontend**: TanStack Start, React 19, TypeScript, Tailwind CSS 4, Recharts, Lucide Icons
- **Database**: MySQL 8.0+ / MariaDB (InnoDB, UTF8mb4)
