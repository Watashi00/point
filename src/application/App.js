require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const token = process.env.DISCORD_TOKEN;
const commandsPath = path.join(__dirname, '../bot/commands/slash');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

client.commands = new Collection();
const commands = [];

// Carregar os comandos
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
  } else {
    console.warn(`[AVISO] O comando "${file}" está incompleto e foi ignorado.`);
  }
}

// Quando o bot estiver pronto
client.once('ready', async () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(token);

  try {
    console.log('🌍 Registrando comandos globalmente...');
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    console.log('✅ Comandos registrados globalmente.');
  } catch (error) {
    console.error('❌ Erro ao registrar comandos:', error);
  }
});

// Lidar com interações (slash)
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: '❌ Ocorreu um erro ao executar este comando.',
      ephemeral: true
    });
  }
});

// Iniciar o bot
client.login(token).catch(console.error);
