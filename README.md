# PressioTrack
Aplicação dedicada ao monitoramento da pressão arterial em tempo real com relatórios.

# Guia de Deploy e Execução

## 1️⃣ Docker Compose

**Subir containers:**

```bash
docker compose up --build
```

**Entrar no container do backend:**

```bash
docker compose exec backend sh
```

**Rodar migrations do Prisma:**

```bash
npx prisma migrate dev
```

**Entrar no MySQL:**

```bash
docker compose exec mysql sh
mysql -u root -p
# senha: root
```

**Acessar o frontend:**
[http://localhost:5173](http://localhost:5173)

---

## 2️⃣ Kubernetes (Kind)

**Entrar na pasta de manifests:**

```bash
cd k8s
```

**Dar permissão e rodar deploy:**

```bash
chmod +x deploy.sh
./deploy.sh
```

**Rodar migrations do Prisma no backend:**

```bash
kubectl exec -it deploy/backend -- npx prisma migrate deploy
```

**Reiniciar o backend:**

```bash
kubectl rollout restart deploy/backend
```

**Acessar o frontend:**
[http://localhost:5173](http://localhost:5173)

---

## 3️⃣ Rodar normal (sem Docker/Kind)

**Frontend:**

```bash
cd frontend
npm run dev
```

**Backend:**

```bash
cd backend
npm start
```

**Acessar o frontend:**
[http://localhost:5173](http://localhost:5173)

---

# Autoras 
- [Alissa Gabriel](https://github.com/AlissaGabriel),
- [Lara Nicoly Ronchesel Ramos](https://github.com/llnick),
- [Raissa Geovana Araujo](https://github.com/raissaaraujo1)

# Introdução

O PressioTrack foi desenvolvido com o objetivo de criar um sistema inteligente de monitoramento contínuo da pressão arterial, capaz de registrar medições automáticas ou manuais, emitir alertas, gerar relatórios detalhados e auxiliar na prevenção de riscos relacionados à saúde cardiovascular.

# Projeto Integrador 

O Projeto Interdisciplinar é uma iniciativa avaliativa do curso de Desenvolvimento de Software Multiplataforma da FATEC - JAHU, com o propósito de integrar conhecimentos e habilidades adquiridas ao longo do curso. Seu foco está em proporcionar experiências práticas por meio do desenvolvimento de soluções reais, fortalecendo a capacidade de trabalho em equipe, o pensamento crítico e a aplicação de metodologias de desenvolvimento. Além disso, busca estimular a inovação, a criatividade e a preparação dos alunos para os desafios do mercado de tecnologia.

# Documentação

A documentação do projeto reúne informações detalhadas sobre o desenvolvimento, principais funcionalidades, tecnologias aplicadas e orientações para utilização. Todo o conteúdo pode ser acessado através do link abaixo:
[Documentação do Projeto](https://github.com/PressioTrack/Documentos).

# Fale conosco

Em caso de dúvidas, sugestões ou comentários sobre a aplicação, entre em contato conosco.
Sua opinião é fundamental para aprimorar o projeto e contribuir para sua evolução contínua.

[Lara Nicoly Ronchesel Ramos](mailto:lara.ramos01@fatec.sp.gov.br)

---

Agradecemos a todos que contribuíram para a concretização deste projeto e esperamos que ele inspire novos aprendizados, aprimoramentos e futuras evoluções na área de desenvolvimento de software.


  
