interface FormatOptions {
    style: 'decimal' | 'currency' | 'percent';
    currency?: string; // uniquement nécessaire si style est 'currency'
    maximumFractionDigits?: number;
    minimumFractionDigits?: number;
  }

  export const formatNumber = (
    price: number,
    format: string = 'en-IN',
    options: FormatOptions = { style: 'currency', currency: 'USD' },
  ): string => {
    // Créez un objet d'options en incluant les propriétés conditionnelles
    const intlOptions: Intl.NumberFormatOptions = {
      style: options.style,
      currency: options.style === 'currency' ? options.currency : undefined,
      maximumFractionDigits: options.maximumFractionDigits,
      minimumFractionDigits: options.minimumFractionDigits,
    };

    return new Intl.NumberFormat(format, intlOptions).format(price);
  };
