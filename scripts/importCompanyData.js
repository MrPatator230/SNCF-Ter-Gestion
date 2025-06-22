import fs from 'fs';
import path from 'path';
import pool from '../utils/mysql.js';

async function createCompanyInfoTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS company_info (
      id INT PRIMARY KEY AUTO_INCREMENT,
      companyName VARCHAR(255),
      companySlogan VARCHAR(255),
      companyDescription TEXT,
      primaryColor VARCHAR(7),
      secondaryColor VARCHAR(7),
      accentColor VARCHAR(7),
      appName VARCHAR(255),
      logoUrl VARCHAR(255),
      faviconUrl VARCHAR(255),
      fontFamily VARCHAR(100),
      buttonStyle VARCHAR(50),
      headerStyle VARCHAR(50),
      footerContent TEXT,
      footerRegions JSON,
      customCss TEXT
    );
  `;
  await pool.query(createTableSQL);
}

async function insertOrUpdateCompanyData(data) {
  const sql = `
    INSERT INTO company_info 
    (companyName, companySlogan, companyDescription, primaryColor, secondaryColor, accentColor, appName, logoUrl, faviconUrl, fontFamily, buttonStyle, headerStyle, footerContent, footerRegions, customCss)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      companyName = VALUES(companyName),
      companySlogan = VALUES(companySlogan),
      companyDescription = VALUES(companyDescription),
      primaryColor = VALUES(primaryColor),
      secondaryColor = VALUES(secondaryColor),
      accentColor = VALUES(accentColor),
      appName = VALUES(appName),
      logoUrl = VALUES(logoUrl),
      faviconUrl = VALUES(faviconUrl),
      fontFamily = VALUES(fontFamily),
      buttonStyle = VALUES(buttonStyle),
      headerStyle = VALUES(headerStyle),
      footerContent = VALUES(footerContent),
      footerRegions = VALUES(footerRegions),
      customCss = VALUES(customCss);
  `;

  const values = [
    data.companyName,
    data.companySlogan,
    data.companyDescription,
    data.primaryColor,
    data.secondaryColor,
    data.accentColor,
    data.appName,
    data.logoUrl,
    data.faviconUrl,
    data.fontFamily,
    data.buttonStyle,
    data.headerStyle,
    data.footerContent,
    JSON.stringify(data.footerRegions),
    data.customCss,
  ];

  await pool.query(sql, values);
}

async function main() {
  try {
    await createCompanyInfoTable();

    const filePath = path.resolve(process.cwd(), 'data', 'entreprise.JSON');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const companyData = JSON.parse(rawData);

    await insertOrUpdateCompanyData(companyData);

    console.log('Company data has been successfully inserted/updated in the database.');
    process.exit(0);
  } catch (error) {
    console.error('Error inserting/updating company data:', error);
    process.exit(1);
  }
}

main();
