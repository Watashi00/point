const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('smashorpass')
    .setDescription('Jogo smash or pass com imagens do Rule34')
    .addStringOption(option =>
      option.setName('termo')
        .setDescription('O termo para busca (ex: neko)')
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.guild) {
      return interaction.reply({ content: '❌ Este comando só pode ser usado em servidores.', ephemeral: true });
    }

    const query = interaction.options.getString('termo').replace(/\s+/g, '_');

    try {
      const res = await axios.get(`https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&limit=100&json=1&tags=${encodeURIComponent(query)}`);
      const posts = res.data;

      if (!posts || posts.length === 0) {
      return interaction.reply('⚠️ Nenhuma imagem encontrada para esse termo.');
      }

      const post = posts[Math.floor(Math.random() * posts.length)];
      const imageUrl = post.file_url;

      const embed = {
      title: `Resultado para: ${query.replace(/_/g, ' ')}`,
      image: { url: imageUrl },
      url: imageUrl,
      color: 0x0099ff,
      footer: { text: '❤️ = Smash | 💔 = Pass' }
      };

      // Envia o embed e adiciona as reações
      const message = await interaction.reply({ embeds: [embed], fetchReply: true });

      await message.react('❤️');  // smash
      await message.react('💔');  // pass

    } catch (err) {
      console.error(err);
      if (!interaction.replied && !interaction.deferred) {
      await interaction.reply('❌ Erro ao buscar imagem. Tente novamente mais tarde.');
      }
    }
    }
  }
