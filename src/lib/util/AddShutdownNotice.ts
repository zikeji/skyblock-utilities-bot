export default function updateFooter(text: string = '') {
  return `${text.length > 0 ? `${text} • ` : ''}SkyBlockZ Utilities is shutting down on 10/31/2020.`
}
