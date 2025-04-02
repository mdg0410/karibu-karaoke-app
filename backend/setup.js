require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Definir los esquemas directamente en el script
const userSchema = new mongoose.Schema({
  nombre: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'staff', 'cliente'] },
  adminToken: String
});

const mesaSchema = new mongoose.Schema({
  numero: { type: Number, unique: true },
  nombre: String,
  capacidad: Number,
  estado: { type: String, enum: ['disponible', 'ocupada', 'reservada'] }
});

// Crear los modelos
const User = mongoose.model('User', userSchema);
const Mesa = mongoose.model('Mesa', mesaSchema);

async function setupEnvironment() {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🌐 Conectado a MongoDB');

    // Limpiar datos existentes
    await User.deleteMany({ role: { $in: ['admin', 'staff'] } });
    await Mesa.deleteMany({});
    console.log('🗑️ Datos anteriores eliminados');

    // Crear mesas
    const mesasPromises = [];
    for (let i = 1; i <= 15; i++) {
      mesasPromises.push(
        Mesa.create({
          numero: i,
          nombre: `Mesa ${i}`,
          capacidad: 4,
          estado: 'disponible'
        })
      );
    }
    await Promise.all(mesasPromises);
    console.log('🪑 15 mesas creadas');

    // Crear admin
    const adminPassword = await bcrypt.hash('CapMir69', 10);
    const admin = await User.create({
      nombre: 'Levo Admin',
      email: 'levo@karibu.com',
      password: adminPassword,
      role: 'admin'
    });
    console.log('👑 Usuario admin creado:');
    console.log(`   Email: levo@karibu.com`);
    console.log(`   Password: CapMir69`);

    // Generar token JWT para el admin
    const adminToken = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    console.log('🔑 Token JWT generado para admin');

    // Guardar token en un archivo
    const tokenData = {
      adminId: admin._id,
      adminEmail: admin.email,
      adminToken: adminToken
    };
    
    const tokensDir = path.join(__dirname, 'tokens');
    if (!fs.existsSync(tokensDir)) {
      fs.mkdirSync(tokensDir);
    }
    
    fs.writeFileSync(
      path.join(tokensDir, 'admin-token.json'),
      JSON.stringify(tokenData, null, 2)
    );
    console.log('💾 Token guardado en tokens/admin-token.json');

    // Crear usuario staff
    const staffPassword = await bcrypt.hash('Karaoke123', 10);
    const staff = await User.create({
      nombre: 'Staff Usuario',
      email: 'staff@karibu.com',
      password: staffPassword,
      role: 'staff',
      adminToken: adminToken
    });
    console.log('👨‍💼 Usuario staff creado:');
    console.log(`   Email: staff@karibu.com`);
    console.log(`   Password: Karaoke123`);
    console.log(`   Admin Token: Enlazado con el admin levo@karibu.com`);

    console.log('\n✅ Configuración completada con éxito');
    console.log('🚀 Ahora puedes iniciar tu aplicación y usar las credenciales creadas');

  } catch (error) {
    console.error('❌ Error durante la configuración:', error);
  } finally {
    // Cerrar conexión a la base de datos
    await mongoose.connection.close();
    process.exit(0);
  }
}

setupEnvironment(); 