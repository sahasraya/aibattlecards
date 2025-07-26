import pool from './db';
import { NextResponse } from 'next/server';

function generateRandomId(length = 30) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    


    if (type === 'search_category') {
    const body = await request.json();
      const { categoryname } = body;

      try {
        const query = `SELECT * FROM category WHERE categoryname ILIKE $1`;
        const result = await pool.query(query, [`%${categoryname}%`]);

        return new Response(JSON.stringify({ data: result.rows }), { status: 200 });
      } catch (error) {
        console.error('Search error:', error);
        return new Response(JSON.stringify({ error: 'Failed to search categories.' }), { status: 500 });
      }
    }
    


    if (type === 'create_new_category') {
      const body = await request.json();
      const { categoryname } = body;

      if (!categoryname) {
        return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
      }

      const cateid = generateRandomId(30);

      const query = `
        INSERT INTO category (cateid, categoryname)
        VALUES ($1, $2)
      `;
      await pool.query(query, [cateid, categoryname]);

      return new Response(JSON.stringify({ message: 'Added' }), { status: 201 });
    }

    if (type === 'fetch_category_data') {
      try {
        const result = await pool.query('SELECT * FROM category ORDER BY created_at DESC');
        const rows = result.rows;
        return NextResponse.json({ data: rows }, { status: 200 });
      } catch (error) {
        console.error('Fetch categories error:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
      }
    }



 if (type === 'delete_category') {
  try {
    const body = await request.json();
    const { cateid } = body;

    if (!cateid) {
      return new Response(JSON.stringify({ error: 'Missing cateid' }), { status: 400 });
    }

    const query = 'DELETE FROM category WHERE cateid = $1';
    await pool.query(query, [cateid]);

    return new Response(JSON.stringify({ message: 'Deleted' }), { status: 200 });
  } catch (error) {
    console.error('Delete category error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete category' }), { status: 500 });
  }
    }
    

if (type === 'update_category') {
  try {
    const body = await request.json();
    const { cateid, categoryname } = body;

    if (!cateid || !categoryname) {
      return new Response(JSON.stringify({ error: 'Missing cateid or categoryname' }), { status: 400 });
    }

    const query = 'UPDATE category SET categoryname = $1 WHERE cateid = $2';
    await pool.query(query, [categoryname, cateid]);

    return new Response(JSON.stringify({ message: 'Updated' }), { status: 200 });

  } catch (error) {
    console.error('Update category error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update category' }), { status: 500 });
  }
    }
    
 
    

    




    return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400 });
  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
