export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgb(0, 0, 0)',
          color: 'rgb(255, 255, 255)',
          fontFamily: 'system-ui',
        }}
      >
        {children}
      </body>
    </html>
  )
}
