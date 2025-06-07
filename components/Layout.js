import Header from './Header';
import Head from 'next/head';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="main-wrapper d-flex flex-column min-vh-100">
      <Head>
        <link 
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" 
          rel="stylesheet"
        />
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
          defer
        ></script>
      </Head>
      <Header />
      <main className="main-container flex-grow-1">
        <div className="container-fluid">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
