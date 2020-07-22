
import express from 'express';
import knex from './database/connection'; // importnado conexao com o banco
const routes = express.Router();
    
routes.get('/items', async (request,response)=>{
  const items = await knex('items').select('*');
  const serializedItens = items.map(item =>{
      return {
        ID: item.id, 
        title: item.title,
        image_url: `http://localhost:3333/uploads/${item.image}`,
      };
  }) ; 
  return response.json(serializedItens);
});

routes.post('/points', async (request, response)=>{
  const {
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    uf,
    items
  } = request.body;

  //const trx = await knex.transaction();

  const insertedIds = await knex('points').insert({
    image: 'image-fake',
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    uf
  });

  const point_id = insertedIds[0];

  const pointItems = items.map((item_id: number)=>{
    return {
      item_id,
      point_id,
    }
  })

    await knex('point_items').insert(pointItems);
    return response.json({ success: true });

});



export default routes;