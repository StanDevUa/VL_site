// pm2-опис процесу ЦЬОГО проєкту на сервері. Не чіпає інші pm2-застосунки
// (n8n, psypanel-backend, pmh-* тощо) — деплой завжди звертається лише до
// цього файлу за назвою (`pm2 startOrReload ecosystem.config.js`), ніколи
// до "pm2 restart all".
module.exports = {
  apps: [
    {
      name: "vl-site",
      cwd: "/var/www/vl_site",
      script: "npm",
      args: "start",
      interpreter: "none",
      env: { PORT: 3400 },
    },
  ],
};
