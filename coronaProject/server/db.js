const mysql = require('mysql2');
require('dotenv').config();
const connection = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  port: process.env.PORT,
  password: process.env.PASSWORD,
  database: "new_database"
});

function create_db() {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      return;
    }

    console.log('Connected to the database.');

    connection.query('CREATE DATABASE IF NOT EXISTS new_database', (error, results, fields) => {
      if (error) {
        console.error('Error creating database: ' + error.stack);
      } else {
        console.log('Database created successfully.');
      }

      connection.release();
    });
  });
}
//create_db();



function create_table() {
  pool.getConnection((err, connection) => {
    if (err) {
      throw err;
    }
    console.log('Connected to MySQL database');

    const createPersonalDetailsTable = `CREATE TABLE IF NOT EXISTS personal_details (
      patient_id INT PRIMARY KEY AUTO_INCREMENT,
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      city VARCHAR(50) NOT NULL,
      street VARCHAR(50) NOT NULL,
      house_number VARCHAR(10) NOT NULL,
      date_of_birth DATE NOT NULL,
      telephone VARCHAR(15),
      mobile_phone VARCHAR(15),
      recovery_date DATE,
      date_receiving_positive DATE
    )`;

    connection.query(createPersonalDetailsTable, (err, result) => {
      if (err) {
        throw err;
      }
      console.log('Personal Details table created');
    });

    const createCoronaVirusDetailsTable = `CREATE TABLE IF NOT EXISTS corona_vaccinations (
      patient_id INT,
      vaccine_date DATE,
      vaccine_manufacturer VARCHAR(50),
      FOREIGN KEY (patient_id) REFERENCES personal_details(patient_id)
    )`;

    connection.query(createCoronaVirusDetailsTable, (err, result) => {
      if (err) {
        throw err;
      }
      console.log('Corona Virus Details table created');
      connection.release();
    });
  });
}


//create_table();

exports.getAllPatients = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        const query = 'SELECT * FROM personal_details';
        connection.query(query, (err, results) => {
          if (err) {
            connection.release();
            reject(err);
          } else {
            const promises = results.map((result) => {
              return new Promise((resolve, reject) => {
                const coronaVaccinationsQuery =
                  `SELECT * FROM corona_vaccinations WHERE patient_id=${result.id}`;
                connection.query(coronaVaccinationsQuery, (err, vaccinations) => {
                  if (err) {
                    reject(err);
                  } else {
                    result.vaccinations = vaccinations;
                    resolve(result);
                  }
                });
              });
            });
            Promise.all(promises)
              .then((data) => {
                resolve(data);
              })
              .catch((err) => {
                reject(err);
              });
          }
          connection.release();
        });
      }
    });
  });
}

exports.getPatientById = (patient_id) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        const query = `SELECT * FROM personal_details WHERE patient_id = ${patient_id}`;
        connection.query(query, [patient_id], (err, results) => {
          if (err) {
            connection.release();
            reject(err);
          } else {
            const coronaQuery = `SELECT * FROM corona_vaccinations WHERE patient_id = ${patient_id}`;
            connection.query(coronaQuery, (err, coronaResults) => {
              if (err) {
                connection.release();
                reject(err);
              } else {
                results[0].vaccinations = coronaResults;
                resolve(results[0]);
              }
            });
          }
          connection.release();
        });
      }
    });
  });
};

exports.deletePatientById = async (patient_id) => {
  try {
    const connection = await pool.getConnection(); // Use connection pool
    const query = `
      DELETE personal_details, corona_vaccinations
      FROM personal_details
      LEFT JOIN corona_vaccinations ON personal_details.id_number = corona_vaccinations.personal_info_id
      WHERE personal_details.patient_id = ?`;

    const [results] = await connection.query(query, [patient_id]); // Destructure results

    connection.release(); // Release connection back to pool
    return results.affectedRows; // Return affected rows count

  } catch (err) {
    console.error('Error deleting patient:', err);
    throw err; // Re-throw for caller to handle
  }
};

exports.updatePatientById = (patient_id, updatedData) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        const query = `UPDATE personal_details SET ? WHERE patient_id = ?`;
        connection.query(query, [updatedData, patient_id], (err, result) => {
          if (err) {
            connection.release();
            reject(err);
          } else {
            resolve(result.affectedRows > 0);
          }
          connection.release();
        });
      }
    });
  });
};

exports.addPatient = (patientData) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        const query = `INSERT INTO personal_details
         (patient_id, first_name, last_name,
          city, street, house_number, date_of_birth,
          telephone, mobile_phone,
          recovery_date, date_receiving_positive)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        connection.query(query, [
          patientData.patient_id, 
          patientData.first_name,
          patientData.last_name,
          patientData.city,
          patientData.street,
          patientData.house_number,
          patientData.date_of_birth,
          patientData.telephone,
          patientData.mobile_phone,
          patientData.recovery_date,
          patientData.date_receiving_positive
        ], (err, result) => {
          if (err) {
            connection.release();
            reject(err);
          } else {
            for (let i = 0; i < patientData.vaccinations.length; i++) {
              const vaccination = patientData.vaccinations[i];
              const coronaVaccinationsQuery = `INSERT INTO corona_vaccinations
               (patient_id, vaccine_date, vaccine_manufacturer)
               VALUES (?, ?, ?)`;

              connection.query(coronaVaccinationsQuery, [patientData.patient_id, vaccination.vaccine_date, vaccination.vaccine_manufacturer], (err) => {
                if (err) {
                  connection.release();
                  reject(err);
                }
              });
            }
            resolve();
          }
          connection.release();
        });
      }
    });
  });
};





