CLUSTER_NAME="pressiotrack-cluster"

echo "=============================="
echo " INICIANDO DEPLOY KUBERNETES "
echo "=============================="

echo ""
echo "1) Verificando se o cluster KIND já existe..."

if kind get clusters | grep -q "^${CLUSTER_NAME}$"; then
    echo "✔ Cluster '${CLUSTER_NAME}' já existe. Pulando criação."
else
    echo "Cluster não existe. Criando '${CLUSTER_NAME}'..."
    kind create cluster --name $CLUSTER_NAME --config kind-config.yaml
fi

echo ""
echo "2) Conferindo contexto do cluster..."
kubectl cluster-info --context kind-${CLUSTER_NAME}

echo ""
echo "3) Baixando imagens do Docker Hub..."
docker pull alissagabriel/pressiotrack-backend:latest
docker pull alissagabriel/pressiotrack-frontend:latest

echo ""
echo "4) Carregando imagens no KIND..."
kind load docker-image alissagabriel/pressiotrack-backend:latest --name $CLUSTER_NAME
kind load docker-image alissagabriel/pressiotrack-frontend:latest --name $CLUSTER_NAME

echo ""
echo "5) Aplicando deployments no Kubernetes..."
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f mysql-deployment.yaml

kubectl get pods 

echo ""
echo "=============================="
echo "DEPLOY FINALIZADO COM SUCESSO!"
echo "------------------------------"
echo "FRONTEND: http://localhost:5173"
echo "BACKEND:  http://localhost:5000"
echo "=============================="
