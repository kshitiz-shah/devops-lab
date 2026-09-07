# DevOps Lab — Complete Viva Questions & Answers Sheet (Projects 1 – 9)

**Student Name:** Kshitij Shah  
**PRN:** 23070122121  
**Course:** DevOps Lab – Level 1  

---

## 📑 Table of Contents
1. [Project 1: Dockerizing Jenkins Pipeline (Flask App)](#project-1-dockerizing-jenkins-pipeline-flask-app)
2. [Project 2: Deploy Angular App in Docker (Multi-Stage & Compose)](#project-2-deploy-angular-app-in-docker-multi-stage--compose)
3. [Project 3: Feature Branching Model & Fast Integration](#project-3-feature-branching-model--fast-integration)
4. [Project 4: Distributed Jenkins Pipeline (Master-Agent Architecture)](#project-4-distributed-jenkins-pipeline-master-agent-architecture)
5. [Project 5: Containerizing Spring Boot App & Security Scanning (Docker Scout)](#project-5-containerizing-spring-boot-app--security-scanning-docker-scout)
6. [Project 6: Kubernetes Autoscaling using HPA (Horizontal Pod Autoscaler)](#project-6-kubernetes-autoscaling-using-hpa-horizontal-pod-autoscaler)
7. [Project 7: MongoDB & Mongo Express with ConfigMaps & Secrets](#project-7-mongodb--mongo-express-with-configmaps--secrets)
8. [Project 8: Multi-Tier Microservice Architecture on Kubernetes](#project-8-multi-tier-microservice-architecture-on-kubernetes)
9. [Project 9: Apache2 Web Server Deployment & Host Access / Port-Forwarding](#project-9-apache2-web-server-deployment--host-access--port-forwarding)
10. [Bonus: Rapid-Fire Core DevOps Terminology & Commands](#bonus-rapid-fire-core-devops-terminology--commands)

---

## Project 1: Dockerizing Jenkins Pipeline (Flask App)

### Q1. What is the difference between a Docker Image and a Docker Container?
- **Answer:** A **Docker Image** is an immutable, read-only template/blueprint containing source code, runtime, libraries, and configuration. A **Docker Container** is a running, stateful instance of an image with an added writable layer on top.

### Q2. Explain the key instructions used in your Flask `Dockerfile`.
- **`FROM python:3.9-slim`**: Base image providing Python runtime.
- **`WORKDIR /app`**: Sets the working directory inside the container for subsequent instructions.
- **`COPY . /app`**: Copies application code from the local machine into the container filesystem.
- **`RUN pip install -r requirements.txt`**: Executes commands at build-time to install dependencies (creates a new image layer).
- **`EXPOSE 5000`**: Documents the container port on which the Flask server listens (metadata documentation).
- **`CMD ["python", "app.py"]`**: Specifies the default command to execute when the container starts.

### Q3. What is the difference between `RUN`, `CMD`, and `ENTRYPOINT`?
- **`RUN`**: Executes commands during image build time and commits the result to a new image layer.
- **`CMD`**: Specifies default arguments/command when the container starts; can be easily overridden via `docker run <image> <new_cmd>`.
- **`ENTRYPOINT`**: Configures a container to run as an executable; parameters passed to `docker run` are appended as arguments rather than overriding it.

### Q4. What does port mapping `-p 5000:5000` do?
- **Answer:** It binds port `5000` on the host machine to port `5000` inside the container (`<Host_Port>:<Container_Port>`), allowing external network traffic reaching host:5000 to be routed to Flask.

### Q5. How does Jenkins automate this process?
- **Answer:** Jenkins pulls the latest code on Git triggers, runs automated unit tests, triggers `docker build -t flask-app .`, and runs `docker run -d -p 5000:5000 flask-app` inside CI/CD stages.

---

## Project 2: Deploy Angular App in Docker (Multi-Stage & Compose)

### Q1. What is a Multi-Stage Docker Build and why is it used?
- **Answer:** Multi-stage builds use multiple `FROM` instructions in a single `Dockerfile`. 
  - **Stage 1 (Build stage - Node.js):** Compiles Angular TypeScript to production bundles (`dist/`).
  - **Stage 2 (Production runtime stage - Nginx Alpine):** Copies only the compiled HTML/JS/CSS static files into Nginx and discards the bulky Node SDK and `node_modules`.
  - **Benefit:** Reduces the final production image size from ~1GB to ~25MB, reducing attack surface and transfer times.

### Q2. What is the purpose of Docker Compose?
- **Answer:** Docker Compose is a tool for defining and running multi-container Docker applications using a declarative YAML file (`docker-compose.yml`). It orchestrates building, networking, environment variables, and volume mounts with a single command (`docker compose up -d`).

### Q3. Why do we maintain separate `Dockerfile.dev` and `Dockerfile` (prod)?
- **Answer:**
  - `Dockerfile.dev` runs the live development server (`ng serve`) with source code volume mounts and hot-reloading.
  - Production `Dockerfile` compiles optimized minified bundles and serves them via high-performance Nginx web server.

### Q4. How does Nginx serve single-page applications (SPAs) like Angular?
- **Answer:** Nginx is configured with `try_files $uri $uri/ /index.html;` so that client-side routes (e.g. `/dashboard`, `/profile`) fallback to `index.html` allowing Angular's client router to handle routing without 404 errors.

---

## Project 3: Feature Branching Model & Fast Integration

### Q1. What is the Feature Branch Workflow in Git?
- **Answer:** A branching strategy where all feature development takes place on dedicated, short-lived branches (e.g., `feature/user-auth`) branched off `main`. Once tested, changes are merged back into `main` via Pull Requests (PRs), keeping `main` always stable and deployable.

### Q2. What is a Merge Conflict and how is it resolved?
- **Answer:** A merge conflict occurs when two branches modify the exact same lines of a file, and Git cannot automatically determine which change to keep. It is resolved manually by inspecting the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), choosing the correct code, staging with `git add`, and committing with `git commit`.

### Q3. What is the difference between `git merge` and `git rebase`?
- **`git merge`**: Combines branches with a non-destructive merge commit, preserving the exact chronological commit history.
- **`git rebase`**: Moves or applies feature commits on top of the latest `main` branch tip, resulting in a linear, clean project history.

### Q4. What is CI (Continuous Integration) in branch development?
- **Answer:** An automated practice where every push or PR to a branch automatically triggers build and test suites to detect integration bugs immediately before merging into `main`.

---

## Project 4: Distributed Jenkins Pipeline (Master-Agent Architecture)

### Q1. What is the Jenkins Master-Agent (Controller-Worker) architecture?
- **Answer:**
  - **Jenkins Master (Controller):** Handles the UI, scheduling builds, managing plugins, storing pipeline configurations, and dispatching tasks.
  - **Jenkins Agents (Nodes/Workers):** Dedicated machines or containers that execute the actual build steps, compilation, and test jobs dispatched by the Master.

### Q2. Why do we distribute builds across agents instead of running everything on Master?
- **Answer:**
  1. **Scalability:** Offloads heavy CPU/RAM tasks (Maven builds, Docker builds).
  2. **Security:** Prevents arbitrary build code from accessing Master configuration files.
  3. **Heterogeneous Environments:** Allows builds across different OS/environments (Linux, macOS, Windows, specific Java versions).

### Q3. What are `stash` and `unstash` in a Declarative Jenkinsfile?
- **Answer:**
  - **`stash`**: Saves files/artifacts generated on one agent (e.g., compiled `.class` files on `node-1`) into Master memory/storage.
  - **`unstash`**: Retrieves and unpacks those saved files onto another agent (e.g., running unit tests on `node-2`) without needing to recompile or commit to Git.

### Q4. What are the standard Maven build lifecycle phases used in Jenkins?
- **`mvn clean`**: Cleans the `target/` output directory.
- **`mvn compile`**: Compiles Java source files into bytecode.
- **`mvn test`**: Runs unit test cases (e.g., JUnit).
- **`mvn package`**: Packages compiled code into a distributable format (`.jar` / `.war`).

---

## Project 5: Containerizing Spring Boot App & Security Scanning (Docker Scout)

### Q1. How is a Spring Boot application containerized efficiently?
- **Answer:** By using a two-stage Dockerfile:
  1. **Build Stage (`maven:3.8-openjdk-17`):** Runs `mvn clean package -DskipTests` to generate `app.jar`.
  2. **Runtime Stage (`eclipse-temurin:17-jre-alpine`):** Copies only `app.jar` and runs `java -jar app.jar`.

### Q2. What is Docker Scout / Vulnerability Scanning?
- **Answer:** Docker Scout analyzes container image layers against Common Vulnerabilities and Exposures (CVE) databases to detect outdated packages, insecure dependencies, and security vulnerabilities in OS and application layers.

### Q3. How do you remediate vulnerabilities found during image scanning?
- **Answer:**
  1. Switch to minimal/hardened base images (e.g., `alpine`, `distroless`).
  2. Update base images and application dependencies in `pom.xml` or `package.json`.
  3. Run containers as non-root users (`USER nonroot`).
  4. Implement multi-stage builds to exclude build tools and package managers from the final image.

---

## Project 6: Kubernetes Autoscaling using HPA (Horizontal Pod Autoscaler)

### Q1. What is the difference between Horizontal and Vertical Pod Autoscaling in Kubernetes?
- **Answer:**
  - **Horizontal Pod Autoscaling (HPA):** Increases or decreases the **number of Pod replicas** (scales OUT/IN).
  - **Vertical Pod Autoscaling (VPA):** Increases or decreases the **CPU and memory resources allocated** to existing Pods (scales UP/DOWN).

### Q2. What prerequisite component is mandatory for HPA to work in Kubernetes?
- **Answer:** The **Kubernetes Metrics Server** must be installed and running in the cluster (`kube-system`), as it collects CPU/memory utilization metrics from the `kubelet` on each node via the `Metrics API`.

### Q3. Explain the fields in a `HorizontalPodAutoscaler` YAML file:
```yaml
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: social-media-deployment
  minReplicas: 1
  maxReplicas: 10
  targetCPUUtilizationPercentage: 50
```
- **`scaleTargetRef`**: The Deployment resource being monitored.
- **`minReplicas` / `maxReplicas`**: The minimum (1) and maximum (10) allowed pod instances.
- **`targetCPUUtilizationPercentage`**: When average CPU across pods exceeds 50% of the requested limit, HPA spins up new pods automatically.

### Q4. Why must Pods define `resources.requests.cpu` for HPA to calculate percentages?
- **Answer:** HPA calculates utilization as `(Current Pod CPU Usage / Requested CPU) * 100%`. If resource requests are not defined in the Deployment manifest, HPA cannot calculate the percentage and will show `<unknown>` status.

---

## Project 7: MongoDB & Mongo Express with ConfigMaps & Secrets

### Q1. What is the difference between a Kubernetes `ConfigMap` and a `Secret`?
- **Answer:**
  - **ConfigMap:** Stores non-confidential configuration data in plaintext key-value pairs (e.g., database URLs, server ports).
  - **Secret:** Stores confidential data (e.g., database passwords, API tokens, TLS certificates) encoded in Base64 to prevent accidental exposure.

### Q2. How do Pods consume ConfigMaps and Secrets?
- **Answer:**
  1. **Environment Variables:** Using `valueFrom.configMapKeyRef` or `valueFrom.secretKeyRef` (or bulk import via `envFrom`).
  2. **Volume Mounts:** Mounted as files inside the container filesystem.

### Q3. What is the default Service type in Kubernetes, and what is the difference between `ClusterIP` and `NodePort`?
- **`ClusterIP` (Default):** Exposes the Service on a cluster-internal IP, making it accessible *only* within the Kubernetes cluster (ideal for internal databases like MongoDB).
- **`NodePort`:** Exposes the Service on each Node's IP at a static port (in the range 30000–32767), allowing external traffic from outside the cluster (ideal for dashboards like Mongo Express).

### Q4. How does Mongo Express find and communicate with MongoDB?
- **Answer:** Via Kubernetes internal DNS. Mongo Express references the MongoDB Service name (e.g., `ME_CONFIG_MONGODB_SERVER: "mongodb-service"`), which CoreDNS automatically resolves to the MongoDB ClusterIP.

---

## Project 8: Multi-Tier Microservice Architecture on Kubernetes

### Q1. Describe the 4 components of your Project 8 microservice architecture.
- **Answer:**
  1. **PostgreSQL User DB (`user-db`):** Stateful relational database storing user records.
  2. **User API (`user-api`):** Backend microservice interacting with PostgreSQL.
  3. **Product API (`product-api`):** Independent microservice serving product catalogs.
  4. **Frontend (`frontend`):** Web client consuming both User API and Product API.

### Q2. How does inter-service communication work in a Kubernetes cluster without hardcoded IP addresses?
- **Answer:** Kubernetes uses **CoreDNS** and **Services**. Each microservice deployment is fronted by a Service. Other pods communicate using the service name (e.g., `http://product-api-service:8080/products`), which Kubernetes load-balances across all matching healthy pod endpoints.

### Q3. Why are microservices deployed in separate Deployments rather than a single large Deployment?
- **Answer:**
  - **Independent Scalability:** If product browsing traffic spikes, scale only `product-api` without wasting resources on `user-db`.
  - **Fault Isolation:** A crash or memory leak in one service doesn't take down the entire system.
  - **Decoupled Deployments:** Teams can update or rollback individual services independently.

---

## Project 9: Apache2 Web Server Deployment & Host Access / Port-Forwarding

### Q1. What is `kubectl port-forward` and when is it used?
- **Answer:** `kubectl port-forward <pod-name/service-name> <host-port>:<pod-port>` forwards traffic from a local port on your host machine directly to a port on a specific Pod or Service inside the cluster over a secure kube-apiserver tunnel. It is primarily used for debugging, testing, and temporary administrative access.

### Q2. Explain the difference between `port`, `targetPort`, and `nodePort` in a Kubernetes Service manifest:
- **`port`**: The port exposed by the Kubernetes Service internally to other cluster resources.
- **`targetPort`**: The actual port on the container inside the Pod where the application listens (e.g., port 80 for Apache).
- **`nodePort`**: The port on the physical/virtual host node (range 30000–32767) accessible to outside users.

### Q3. What is the role of `labels` and `selectors` in Kubernetes?
- **Answer:** They decouple Kubernetes objects. A Deployment assigns `labels` (e.g., `app: apache`) to its Pods, and a Service uses `selector: app: apache` to identify and route traffic to all active Pods matching those labels.

---

## ⚡ Bonus: Rapid-Fire Core DevOps Terminology & Commands

| Command | Purpose |
| :--- | :--- |
| `docker ps -a` | Lists all containers (both running and stopped). |
| `docker build -t <tag> .` | Builds a Docker image from a `Dockerfile`. |
| `docker logs <container_id>` | Displays standard output/error logs of a container. |
| `kubectl get pods -o wide` | Lists all pods with node names and assigned pod IPs. |
| `kubectl describe pod <name>` | Displays detailed pod events, lifecycle states, and troubleshooting info. |
| `kubectl logs -f <pod-name>` | Streams real-time live logs from a Kubernetes pod. |
| `kubectl apply -f <file.yaml>` | Declaratively creates or updates cluster resources. |
| `kubectl get hpa` | Displays current autoscaler metrics, targets, and replica counts. |
| `kubectl exec -it <pod> -- sh` | Opens an interactive terminal shell inside a running container. |

---
*Created for Kshitij Shah — DevOps Lab Level 1 Practical & Viva Examination.*
