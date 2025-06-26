# CHAT SEGURO

## Visão Geral

Este projeto consiste em um sistema seguro de comunicação ponto-a-ponto, desenvolvido para garantir autenticação, sigilo e integridade nas mensagens trocadas entre utilizadores. A implementação combina técnicas avançadas de criptografia, incluindo criptografia simétrica (AES), assinaturas digitais (RSA), troca segura de chaves (Diffie-Hellman) e mecanismos de integridade (HMAC), além de armazenamento seguro de credenciais com algoritmos modernos de hash .

## Tecnologias Usadas

- **Backend**: Implementado em Java, utilizando WebSockets para comunicação em tempo real entre os utilizadores. O backend é responsável por toda a lógica de criptografia, autenticação e gestão de sessões seguras.

- **Frontend**: Desenvolvido com Vite, React.js e TypeScript, oferecendo uma interface intuitiva e responsiva para interação dos utilizadores com o sistema.

## Instalar e Executar

### Requisitos

- Java Development Kit 17+ Instalado (openjdk-17-jdk)
- Node e NPM instalado (Node 20.19+ e npm 11.3+)
- Editor preferencial Visual Studio Code

### Instalar

1. Rodar Servidor:
   ```
   javac main.java
   java main
   ```
2. Instalar e Rodar Frontend :
   ```
   cd chat_seguro
    npm install
    npm run dev
   ```

## Teoria

## Implementação

## Considerações Finais

Este projeto representou uma oportunidade valiosa para explorar na prática os desafios e soluções envolvidos na construção de um sistema de comunicação seguro. Ao longo do desenvolvimento, foi possível consolidar conhecimentos teóricos em criptografia aplicada, desde os fundamentos até técnicas mais avançadas, sempre com o objetivo de garantir a segurança das informações trocadas entre os utilizadores.

A implementação combinou diferentes tecnologias e abordagens, resultando num sistema funcional que atende aos principais requisitos de segurança: autenticação robusta, confidencialidade dos dados e garantia de integridade. O uso de WebSockets permitiu criar uma experiência de comunicação em tempo real, enquanto a escolha de algoritmos modernos como AES, RSA e Diffie-Hellman assegurou a proteção adequada contra ameaças comuns.

O processo trouxe também diversos aprendizados, como a importância de gerir corretamente chaves criptográficas, a necessidade de validar cuidadosamente cada componente do sistema e os desafios de equilibrar segurança com desempenho. Algumas limitações identificadas, como o impacto da criptografia assimétrica na performance, abrem espaço para otimizações futuras, seja através de algoritmos mais eficientes ou de técnicas como a criptografia pós-quântica.
