import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

function SmokeComponent() {
  return <h1>Gymentality Testing</h1>
}

describe('Configuración de pruebas frontend', () => {
  it('renderiza un componente básico', () => {
    render(<SmokeComponent />)

    expect(screen.getByText('Gymentality Testing')).toBeInTheDocument()
  })
})
