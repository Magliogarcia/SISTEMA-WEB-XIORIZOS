/**
 * Utilidades de validación estricta para formularios de Xiorizos.
 * Soporta números de teléfono válidos de Venezuela (+58) y Colombia (+57),
 * nombres reales, correos y datos de pago.
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  formatted?: string;
  country?: "VE";
}

/**
 * Filtra la entrada del usuario en tiempo real para permitir únicamente
 * caracteres telefónicos válidos (+, números, espacios y guiones).
 * Impide absolutamente la inserción de letras.
 */
export function filterPhoneInput(value: string): string {
  // Permite '+' solo al inicio y solo dígitos, espacios o guiones
  let cleaned = value.replace(/[^0-9+\s-]/g, "");
  // Si hay un '+' que no esté al inicio, eliminarlo
  if (cleaned.indexOf("+") > 0) {
    cleaned = cleaned.charAt(0) + cleaned.slice(1).replace(/\+/g, "");
  }
  // No permitir más de un '+'
  if ((cleaned.match(/\+/g) || []).length > 1) {
    cleaned = "+" + cleaned.replace(/\+/g, "");
  }
  return cleaned;
}

/**
 * Filtra la entrada de nombre en tiempo real para no permitir números ni símbolos raros.
 */
export function filterNameInput(value: string): string {
  return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, "");
}

/**
 * Detecta si un string contiene secuencias absurdas repetidas (ej: '0000000', '1111111')
 */
function hasTrivialRepetition(str: string, maxConsecutive: number = 5): boolean {
  return new RegExp(`(.)\\1{${maxConsecutive},}`).test(str);
}

/**
 * Valida de forma estricta un número de teléfono celular de Venezuela.
 * Operadoras válidas: 0412 (Digitel), 0414/0424 (Movistar), 0416/0426 (Movilnet).
 * Formato nacional: 11 dígitos (0412 1234567).
 * Formato internacional: +58 412 1234567.
 */
export function validatePhone(rawPhone: string): ValidationResult {
  const trimmed = rawPhone.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: "El número de teléfono es obligatorio.",
    };
  }

  // Verificar si contiene letras
  if (/[a-zA-Z]/.test(trimmed)) {
    return {
      isValid: false,
      error: "El teléfono no puede contener letras, solo números.",
    };
  }

  // Quitar espacios, guiones y paréntesis para el análisis numérico
  const digitsOnly = trimmed.replace(/\D/g, "");

  // VENEZUELA:
  // Prefijos móviles venezolanos: 0412, 0414, 0424, 0416, 0426
  // Formato nacional: 11 dígitos exactos (0412XXXXXXX)
  // Formato internacional: 58 + 412/414/424/416/426 + 7 dígitos (12 dígitos numéricos en total)
  const veNationalRegex = /^0(412|414|424|416|426)(\d{7})$/;
  const veIntlRegex = /^58(412|414|424|416|426)(\d{7})$/;

  if (veNationalRegex.test(digitsOnly)) {
    const match = digitsOnly.match(veNationalRegex)!;
    const subscriber = match[2];

    if (hasTrivialRepetition(subscriber, 5)) {
      return {
        isValid: false,
        error: "Ingresa un número celular venezolano real y válido.",
      };
    }

    const formatted = `0${match[1]} ${subscriber.slice(0, 3)} ${subscriber.slice(3)}`;
    return {
      isValid: true,
      formatted,
      country: "VE",
    };
  }

  if (veIntlRegex.test(digitsOnly)) {
    const match = digitsOnly.match(veIntlRegex)!;
    const subscriber = match[2];

    if (hasTrivialRepetition(subscriber, 5)) {
      return {
        isValid: false,
        error: "Ingresa un número celular venezolano real y válido.",
      };
    }

    const formatted = `+58 ${match[1]} ${subscriber.slice(0, 3)} ${subscriber.slice(3)}`;
    return {
      isValid: true,
      formatted,
      country: "VE",
    };
  }

  if (digitsOnly.length < 11) {
    return {
      isValid: false,
      error: "El número debe tener 11 dígitos (ej. 0412 1234567 o +58 412 1234567).",
    };
  }

  return {
    isValid: false,
    error: "Ingresa un número celular venezolano válido (0412, 0414, 0424, 0416 o 0426).",
  };
}

/**
 * Valida nombres completos asegurando que no tenga números, caracteres absurdos o solo una palabra.
 */
export function validateFullName(rawName: string): ValidationResult {
  const trimmed = rawName.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: "El nombre completo es obligatorio.",
    };
  }

  if (/\d/.test(trimmed)) {
    return {
      isValid: false,
      error: "El nombre no puede contener números.",
    };
  }

  // Permitir letras latinas, tildes, diéresis, ñ, espacios, apóstrofe y guion
  const validCharsRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
  if (!validCharsRegex.test(trimmed)) {
    return {
      isValid: false,
      error: "El nombre solo debe contener letras y espacios (sin símbolos especiales).",
    };
  }

  const words = trimmed.split(/\s+/).filter((w) => w.length > 0);
  if (words.length < 2) {
    return {
      isValid: false,
      error: "Por favor ingresa tu nombre y apellido (al menos dos palabras).",
    };
  }

  for (const word of words) {
    if (word.length < 2) {
      return {
        isValid: false,
        error: "Cada palabra de tu nombre debe tener al menos 2 letras.",
      };
    }
    // Cada palabra debe tener al menos una vocal
    const hasVowel = /[aeiouáéíóúüAEIOUÁÉÍÓÚÜ]/.test(word);
    if (!hasVowel) {
      return {
        isValid: false,
        error: `El nombre '${word}' no parece un nombre real válido.`,
      };
    }
  }

  if (hasTrivialRepetition(trimmed.toLowerCase().replace(/\s/g, ""), 4)) {
    return {
      isValid: false,
      error: "Por favor ingresa un nombre y apellido legítimo.",
    };
  }

  // Formatear capitalizando cada palabra
  const formatted = words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  return {
    isValid: true,
    formatted,
  };
}

/**
 * Valida un correo electrónico.
 */
export function validateEmail(rawEmail: string): ValidationResult {
  const trimmed = rawEmail.trim().toLowerCase();

  if (!trimmed) {
    return {
      isValid: false,
      error: "El correo electrónico es obligatorio.",
    };
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return {
      isValid: false,
      error: "Ingresa un correo electrónico válido (ej. usuario@correo.com).",
    };
  }

  return {
    isValid: true,
    formatted: trimmed,
  };
}

/**
 * Valida una dirección física de entrega.
 */
export function validateAddress(rawAddress: string): ValidationResult {
  const trimmed = rawAddress.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: "La dirección de entrega es obligatoria.",
    };
  }

  if (trimmed.length < 8) {
    return {
      isValid: false,
      error: "Por favor ingresa una dirección detallada (mínimo 8 caracteres).",
    };
  }

  // Asegurar que contenga al menos algunas letras
  if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(trimmed)) {
    return {
      isValid: false,
      error: "La dirección debe contener el nombre de la calle, sector o avenida.",
    };
  }

  return {
    isValid: true,
    formatted: trimmed,
  };
}

/**
 * Validación de tarjeta con algoritmo de Luhn (para simulación de checkout).
 */
export function validateCardNumber(rawCard: string): ValidationResult {
  const cleaned = rawCard.replace(/\D/g, "");

  if (!cleaned) {
    return { isValid: false, error: "El número de tarjeta es obligatorio." };
  }

  if (cleaned.length < 13 || cleaned.length > 19) {
    return { isValid: false, error: "El número de tarjeta debe tener entre 13 y 19 dígitos." };
  }

  // Algoritmo de Luhn
  let sum = 0;
  let shouldDouble = false;
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  if (sum % 10 !== 0) {
    return { isValid: false, error: "Número de tarjeta inválido." };
  }

  // Formato agrupado en bloques de 4
  const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
  return { isValid: true, formatted };
}

/**
 * Valida vencimiento de tarjeta (MM/AA).
 */
export function validateCardExpiry(rawExpiry: string): ValidationResult {
  const trimmed = rawExpiry.trim();
  const match = trimmed.match(/^(\d{2})\/?(\d{2})$/);

  if (!match) {
    return { isValid: false, error: "Formato inválido. Usa MM/AA." };
  }

  const month = parseInt(match[1], 10);
  const year = parseInt("20" + match[2], 10);

  if (month < 1 || month > 12) {
    return { isValid: false, error: "Mes inválido (01-12)." };
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return { isValid: false, error: "La tarjeta ya está vencida." };
  }

  return { isValid: true, formatted: `${match[1]}/${match[2]}` };
}

/**
 * Valida CVV (3 o 4 dígitos).
 */
export function validateCVV(rawCVV: string): ValidationResult {
  const cleaned = rawCVV.replace(/\D/g, "");
  if (cleaned.length < 3 || cleaned.length > 4) {
    return { isValid: false, error: "El CVV debe tener 3 o 4 dígitos." };
  }
  return { isValid: true, formatted: cleaned };
}

