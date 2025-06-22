import pool from '../../utils/mysql';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT * FROM entreprise ORDER BY id DESC LIMIT 1');
      if (rows.length === 0) {
        // Return default settings if no data in DB
        res.status(200).json({
          companyName: 'Ma Société Ferroviaire',
          companySlogan: 'Le transport ferroviaire simplifié',
          companyDescription: 'Description de la société ferroviaire...',
          primaryColor: '#007bff',
          secondaryColor: '#6c757d',
          accentColor: '#28a745',
          appName: 'Train Schedule Management',
          logoUrl: '/images/logo-ter-mobigo.svg',
          faviconUrl: '/favicon.ico',
          fontFamily: 'Inter',
          buttonStyle: 'rounded',
          headerStyle: 'default',
          footerContent: '© 2024 Ma Société Ferroviaire',
          footerRegions: [],
          customCss: '',
        });
      } else {
        const settings = rows[0];
        // Parse JSON fields
        settings.footerRegions = JSON.parse(settings.footerRegions);
        res.status(200).json(settings);
      }
    } catch (error) {
      console.error('Failed to fetch settings from DB:', error);
      res.status(500).json({ error: 'Failed to read settings' });
    }
  } else if (req.method === 'POST') {
    try {
      const settings = req.body;
      // Upsert entreprise data: if exists update, else insert
      const [rows] = await pool.query('SELECT id FROM entreprise ORDER BY id DESC LIMIT 1');
      if (rows.length === 0) {
        await pool.query(
          `INSERT INTO entreprise 
          (companyName, companySlogan, companyDescription, primaryColor, secondaryColor, accentColor, appName, logoUrl, faviconUrl, fontFamily, buttonStyle, headerStyle, footerContent, footerRegions, customCss) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
            JSON.stringify(settings.footerRegions),
            settings.customCss,
          ]
        );
      } else {
        const id = rows[0].id;
        await pool.query(
          `UPDATE entreprise SET 
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
            JSON.stringify(settings.footerRegions),
            settings.customCss,
            id,
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
