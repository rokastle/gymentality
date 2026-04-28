import { describe, expect, it } from 'vitest'
import {
  normalizeText,
  normalizePostalCode,
  validateAccountField,
  validateSignUpForm,
  validateProfileEmailForm,
  hasValidationErrors,
} from './accountValidation'

describe('accountValidation', () => {
  it('normaliza textos eliminando espacios al inicio y al final', () => {
    expect(normalizeText('  Roberto  ')).toBe('Roberto')
    expect(normalizeText(null)).toBe('')
  })

  it('normaliza el código postal dejando solo 5 dígitos', () => {
    expect(normalizePostalCode('29A00-123')).toBe('29001')
  })

  it('valida un email correcto y rechaza uno inválido', () => {
    expect(validateAccountField('email', 'socio@gymentality.com')).toBe('')
    expect(validateAccountField('email', 'socio-incorrecto')).toBe(
      'Invalid email (e.g., user@mail.com)'
    )
  })

  it('valida una contraseña segura y rechaza una débil', () => {
    expect(validateAccountField('password', 'Password1@')).toBe('')
    expect(validateAccountField('password', 'password')).toBe(
      'Min 8 characters, uppercase, lowercase, number, symbol (@$!%*?&)'
    )
  })

  it('comprueba que la confirmación de contraseña coincida', () => {
    expect(
      validateAccountField('confirmPassword', 'Password1@', {
        password: 'Password1@',
      })
    ).toBe('')

    expect(
      validateAccountField('confirmPassword', 'Password2@', {
        password: 'Password1@',
      })
    ).toBe('Passwords do not match')
  })

  it('valida que el nuevo email sea diferente al email actual', () => {
    const errors = validateProfileEmailForm({
      email: 'socio@gymentality.com',
      newEmail: 'SOCIO@gymentality.com',
    })

    expect(errors.newEmail).toBe('New email must be different from current email')
    expect(hasValidationErrors(errors)).toBe(true)
  })

  it('valida correctamente un formulario completo de alta como socio', () => {
    const validSignUpForm = {
      firstName: 'Roberto',
      lastName: 'Castillo',
      gender: 'Male',
      dateOfBirth: '1990-01-01',
      email: 'socio@gymentality.com',
      phone: '+34 600-123-456',
      password: 'Password1@',
      confirmPassword: 'Password1@',
      address: 'Calle Test 1',
      postalCode: '29001',
      country: 'España',
      region: 'Andalucía',
      city: 'Málaga',
      cardholder: 'Roberto Castillo',
      cardNumber: '4111 1111 1111 1111',
      expiryMonth: '12',
      expiryYear: String(new Date().getFullYear() + 1),
      cvv: '123',
      acceptedTerms: true,
    }

    const errors = validateSignUpForm(validSignUpForm)

    expect(hasValidationErrors(errors)).toBe(false)
  })

  it('detecta errores en un formulario de alta incompleto', () => {
    const errors = validateSignUpForm({
      firstName: '',
      email: 'email-invalido',
      password: '123',
      acceptedTerms: false,
    })

    expect(hasValidationErrors(errors)).toBe(true)
    expect(errors.firstName).toBe('Required field')
    expect(errors.email).toBe('Invalid email (e.g., user@mail.com)')
    expect(errors.password).toBe(
      'Min 8 characters, uppercase, lowercase, number, symbol (@$!%*?&)'
    )
    expect(errors.acceptedTerms).toBe('You must accept the terms and privacy policy')
  })
})
