import pool from '../../utils/mysql.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT * FROM company_info LIMIT 1');
      if (rows.length > 0) {
        const companyData = rows[0];
        // Parse JSON fields
        companyData.footerRegions = companyData.footerRegions ? JSON.parse(companyData.footerRegions) : [];
        res.status(200).json(companyData);
      } else {
        res.status(200).json({
          companyName: 'Ma Société Ferroviaire',
          companySlogan: 'Le transport ferroviaire simplifié',
          companyDescription: 'Description de la société ferroviaire...',
          primaryColor: '#007bff',
          secondaryColor: '#6c757d',
          appName: 'Train Schedule Management',
          footerRegions: [],
        });
      }
    } catch (error) {
      console.error('Failed to read settings from DB:', error);
      res.status(500).json({ error: 'Failed to read settings' });
    }
  } else if (req.method === 'POST') {
    try {
      const settings = req.body;
      const footerRegionsJson = JSON.stringify(settings.footerRegions || []);
      // Check if a record exists
      const [rows] = await pool.query('SELECT id FROM company_info LIMIT 1');
      if (rows.length > 0) {
        // Update existing record
        await pool.query(
          `UPDATE company_info SET
            companyName = ?,
            companySlogan = ?,
            companyDescription = ?,
            primaryColor = ?,
            secondaryColor = ?,
            accentColor = ?,
            appName = ?,
            logoUrl = ?,
            faviconUrl = ?,
            fontFamily = ?,
            buttonStyle = ?,
            headerStyle = ?,
            footerContent = ?,
            footerRegions = ?,
            customCss = ?
          WHERE id = ?`,
          [
            settings.companyName,
            settings.companySlogan,
            settings.companyDescription,
            settings.primaryColor,
            settings.secondaryColor,
            settings.accentColor,
            settings.appName,
            settings.logoUrl,
            settings.faviconUrl,
            settings.fontFamily,
            settings.buttonStyle,
            settings.headerStyle,
            settings.footerContent,
            footerRegionsJson,
            settings.customCss,
            rows[0].id,
          ]
        );
      } else {
        // Insert new record
        await pool.query(
          `INSERT INTO company_info (
            companyName, companySlogan, companyDescription, primaryColor, secondaryColor, accentColor, appName, logoUrl, faviconUrl, fontFamily, buttonStyle, headerStyle, footerContent, footerRegions, customCss
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            settings.companyName,
            settings.companySlogan,
            settings.companyDescription,
            settings.primaryColor,
            settings.secondaryColor,
            settings.accentColor,
            settings.appName,
            settings.logoUrl,
            settings.faviconUrl,
            settings.fontFamily,
            settings.buttonStyle,
            settings.headerStyle,
            settings.footerContent,
            footerRegionsJson,
            settings.customCss,
          ]
        );
      }
      res.status(200).json({ message: 'Settings saved successfully' });
    } catch (error) {
      console.error('Error saving settings to DB:', error);
      res.status(500).json({ error: 'Failed to save settings' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
