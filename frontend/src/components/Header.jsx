function Header() {
    return (
      <header style={{
        display: 'flex',
        alignItems: 'center',
        padding: '15px 30px',
        backgroundColor: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
      }}>
        
        {/* Logo violet vif */}
        <div style={{
          width: '45px',
          height: '45px',
          background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          marginRight: '10px',
          boxShadow: '0 4px 15px rgba(124, 58, 237, 0.5)'
        }}>
          ✨
        </div>
  
        {/* Texte STAGII */}
        <span style={{
          fontSize: '22px',
          fontWeight: '800',
          color: '#1e1b4b',
          letterSpacing: '-0.5px'
        }}>
          STAGII
        </span>
  
      </header>
    );
  }
  
  export default Header;