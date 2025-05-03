## Overview

`aiBike`...

## System Requirements

- .NET SDK 8.0.0

## Initial Setup

### 1. Clone the Repository (Optional)

```bash
git clone <repository_url>
```

Navigate to the server directory.

```bash
cd server
```

### 2. Install .NET Dependencies

```bash
dotnet restore
```

### 3. Set up the database

Run the following command to start the database container. Make sure you have Docker desktop opened.

```
docker-compose up -d
```

To stop and remove the containers, including their volumes and any stored data, run:

```
docker-compose down -v
```

## How to Run

### Backend

To run the backend, navigate server directory and execute:

```bash
dotnet run
```
