const { SlashCommandBuilder } = require('discord.js');
const os = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Exibe informações sobre o bot'),

    async execute(interaction) {
        const botAvatar = interaction.client.user.displayAvatarURL();
        const ping = Math.round(interaction.client.ws.ping);
        const cpu = os.cpus()[0].model;
        const platform = os.platform();
        const arch = os.arch();
        const memory = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);

        const embed = {
            title: 'Informações do Bot',
            description: 'Olá! Eu sou um bot criado para ajudar e entreter os membros de servidores.',
            fields: [
                {
                    name: 'Criador',
                    value: 'W. | rietakahashi_wata (266320567420977181)',
                    inline: true
                },
                {
                    name: 'Versão',
                    value: '0.1.3',
                    inline: true
                },
                {
                    name: 'Site para suporte',
                    value: '[Em desenvolvimento]',
                    inline: false
                },
                {
                    name: 'Ping',
                    value: `${ping}ms`,
                    inline: true
                },
                {
                    name: 'CPU',
                    value: cpu,
                    inline: false
                },
                {
                    name: 'Sistema',
                    value: `${platform} (${arch})`,
                    inline: true
                },
                {
                    name: 'Memória RAM total',
                    value: `${memory} GB`,
                    inline: true
                }
            ],
            color: 0x0099ff,
            footer: {
                text: 'Obrigado por usar nosso bot!',
                icon_url: botAvatar
            },
            thumbnail: {
                url: botAvatar
            }
        };
        await interaction.reply({ embeds: [embed] });
    }
}
