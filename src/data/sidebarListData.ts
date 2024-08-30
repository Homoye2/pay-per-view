import sitemap from 'routes/sitemap';

export const topListData = sitemap.filter((item) => {
  const id = item.id;
  if (
    id === 'settings' ||
    id === 'user' ||
    id === 'authentication'||
    id === 'transaction'
  ) {
    return null;
  }
  return item;
});

export const bottomListData = sitemap.filter((item) => {
  const id = item.id;
  if ( id === 'settings' || id === 'authentication'||id === 'user'||   id === 'transaction') {
    return item;
  }
  return null;
});

export const profileListData = sitemap.find((item) => item.id === 'account-settings');
