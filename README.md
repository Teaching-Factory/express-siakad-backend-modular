# Backend SIAKAD (Sistem Informasi Akademik) - Tugas Akhir 🧑🏻‍🎓

Selamat Datang di aplikasi backend sistem informasi akademik. Project ini dikembangkan dengan tujuan untuk memenuhi kebutuhan pengerjaan tugas akhir dan juga pengembangan aplikasi Sistem Informasi Akademik (SIAKAD) secara terpisah antara backend dengan frontend. Aplikasi ini dikembangkan dengan menggunakan bahasa Javascript melalui framework node js. Aplikasi ini juga mengimplementasikan API local dan API diluar aplikasi yaitu menggunakan API DIKTI.

## Installation Backend App 📌

- Melakukan Clonning Project ke Local :

```bash
  git clone https://github.com/Teaching-Factory/express-siakad-backend

```

Install Paket :

- Instal Plugin Yarn :

```bash
  yarn install

```

- Instal Plugin Express dan Nodemon :

```bash
  yarn add express nodemon

```

- Upgrade Nvm ke Versi 16.14 - Langkah 1 :

```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

```

- Upgrade Nvm ke Versi 16.14 - Langkah 2 :

```bash
  export NVM_DIR="$HOME/.nvm"

```

- Upgrade Nvm ke Versi 16.14 - Langkah 3 :

```bash
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

```

- Upgrade Nvm ke Versi 16.14 - Langkah 4 (Opsional) :

```bash
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

```

- Instal Nvm Versi 16.14 :

```bash
  nvm install 16.14

```

- Pakai Nvm 16.14 :

```bash
  nvm use 16.14

```

- Instal Plugin MySql2 :

```bash
  yarn add mysql2

```

- Instal Plugin DotEnv :

```bash
  yarn add dotenv

```

- Instal Plugin Sequelize :

```bash
  yarn add sequelize

```

- Inisialisasi Sequelize :

```bash
  npx sequelize-cli init

```

- Instal Plugin Npm :

```bash
  npm install

```

- Instal Plugin Axios :

```bash
  npm install axios

```

- Instal Plugin Bcrypt :

```bash
  npm install bcrypt

```

- Instal Plugin Json Web Token (JWT) :

```bash
  npm install jsonweb jsonwebtoken

```

- Instal Plugin Multer untuk upload file :

```bash
  npm install multer npm install cors

```

- Instal Plugin CORS untuk resource sharing :

```bash
  npm install cors

```

- Instal Plugin Exceljs :

```bash
  npm install exceljs

```

- Instal Plugin Moment Timezone :

```bash
  npm install moment-timezone

```

- Instal Plugin Node Schedule untuk menghapus token expired secara berkala :

```bash
  npm install node-schedule

```

- Instal Plugin untuk pengujian Unit Testing :

```bash
  npm install --save-dev jest @babel/core @babel/preset-env
  npm install node-mocks-http

```

- Memperbaiki Plugin yang corrupt (Optional) :

```bash
  npm audit fix

```

- Jalankan Aplikasi :

```bash
  yarn start

```

Perintah Migrasi Dan Seeder :

- Membuat Migrasi Baru :

```bash
  npx sequelize-cli model:generate --name ModelName --attributes column:type_data,column:type_data

```

- Membuat Seeder :

```bash
  npx sequelize-cli seed:generate --name seed-table-name

```

- Menjalankan Seeder :

```bash
  npx sequelize-cli db:seed:all

```

- Melakukan Migrasi :

```bash
  npx sequelize-cli db:migrate

```

- Membatalkan Migrasi Sebelumnya :

```bash
  npx sequelize-cli db:migrate:undo

```

- Membatalkan Semua Migrasi :

```bash
  npx sequelize-cli db:migrate:undo:all

```

Perintah Pengujian Unit Testing :

- Menjalankan kode uji manual :

```bash
  npx jest test/folder-path/fileName.test.js

```

## Support and Thanks ✨

For support credit, please email owner of this project : magangti2023@gmail.com. Thanks to our developper by TEFA Team 🎉🎉🎉
