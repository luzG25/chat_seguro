from websocket_server import WebsocketServer


clientes = []

# Quando um novo cliente se conecta
def cliente_conectado(cliente, server):
    print(f"Novo cliente conectado: {cliente['id']}")
    clientes.append(cliente)

# Quando um cliente desconecta
def cliente_desconectado(cliente, server):
    print(f"Cliente desconectado: {cliente['id']}")
    if cliente in clientes:
        clientes.remove(cliente)

# Quando uma mensagem é recebida
def mensagem_recebida(cliente, server, mensagem):
    print(f"Mensagem recebida: {mensagem}")
    # Envia para todos os clientes, exceto quem enviou
    for c in clientes:
        #if c != cliente:
        server.send_message(c, mensagem)

# Cria o servidor
server = WebsocketServer(host='0.0.0.0', port=8765)
server.set_fn_new_client(cliente_conectado)
server.set_fn_client_left(cliente_desconectado)
server.set_fn_message_received(mensagem_recebida)

print("Servidor WebSocket iniciado em ws://localhost:8765")
server.run_forever()
