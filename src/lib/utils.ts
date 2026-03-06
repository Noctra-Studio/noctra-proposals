export function generateSlug(projectName: string, prefix: string = ""): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  
  const formattedProjectName = projectName
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with dashes
    .replace(/(^-|-$)+/g, ''); // trim dashes
    
  const randomChars = Math.random().toString(36).substring(2, 6);
  
  const baseSlug = `${year}-${month}-${formattedProjectName}-${randomChars}`;
  return prefix ? `${prefix}-${baseSlug}` : baseSlug;
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);
}