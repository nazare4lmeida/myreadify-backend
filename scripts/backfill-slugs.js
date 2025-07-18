// scripts/backfill-slugs.js

require('dotenv').config();
const slugify = require('slugify');
const Book = require('../src/models/Book');
require('../src/database'); // Conecta ao banco

async function backfillSlugs() {
  console.log('Iniciando o script para preencher slugs...');
  
  const booksToUpdate = await Book.findAll({ where: { slug: null } });

  if (booksToUpdate.length === 0) {
    console.log('Nenhum livro para atualizar. Tudo certo!');
    return;
  }

  console.log(`Encontrados ${booksToUpdate.length} livros sem slug. Atualizando...`);

  for (const book of booksToUpdate) {
    try {
      const newSlug = slugify(book.title, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
      book.slug = newSlug;
      await book.save();
      console.log(`- Slug '${newSlug}' salvo para o livro ID ${book.id}`);
    } catch (error) {
      console.error(`! Erro ao salvar slug para o livro ID ${book.id}:`, error.message);
      // Adiciona um sufixo aleatório em caso de colisão
      const newSlugWithSuffix = `${slugify(book.title, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g })}-${Math.floor(Math.random() * 1000)}`;
      book.slug = newSlugWithSuffix;
      await book.save();
      console.log(`- Tentativa com sufixo: Slug '${newSlugWithSuffix}' salvo para o livro ID ${book.id}`);
    }
  }

  console.log('Script finalizado com sucesso!');
  process.exit();
}

backfillSlugs();