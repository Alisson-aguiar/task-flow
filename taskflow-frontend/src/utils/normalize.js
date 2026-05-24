// Função para corrigir textos com problemas de encoding
export const fixText = (text) => {
  if (!text) return '';
  
  let fixed = text;
  
  // Substituições comuns
  const fixes = [
    ['Jo�o', 'João'],
    ['Joo', 'João'],
    ['João', 'João'],
    ['Ã£', 'ã'],
    ['Ãµ', 'õ'],
    ['Ã¡', 'á'],
    ['Ã©', 'é'],
    ['Ã­', 'í'],
    ['Ã³', 'ó'],
    ['Ãº', 'ú'],
    ['Ã¢', 'â'],
    ['Ãª', 'ê'],
    ['Ã´', 'ô'],
    ['Ã»', 'û'],
    ['Ã§', 'ç'],
    ['�', '']
  ];
  
  for (const [bad, good] of fixes) {
    fixed = fixed.split(bad).join(good);
  }
  
  return fixed;
};

// Função para corrigir o usuário no localStorage
export const fixUserData = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.name) {
        const fixedName = fixText(user.name);
        if (fixedName !== user.name) {
          user.name = fixedName;
          localStorage.setItem('user', JSON.stringify(user));
          console.log('✅ Nome corrigido:', user.name);
          return true;
        }
      }
    } catch (e) {
      console.error('Erro ao corrigir usuário', e);
    }
  }
  return false;
};

// Criar um novo usuário com nome correto
export const createNewUser = () => {
  // Forçar logout
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};
