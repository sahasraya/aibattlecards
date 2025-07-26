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
 
    // Only parse body for types that need it
    let body = {};
    if (type !== 'fetch_flair_data') {
      body = await request.json();
    }

    if (type === 'fetch_flair_data') {
      try {
        const result = await pool.query('SELECT * FROM flair ORDER BY created_at DESC');
        return NextResponse.json({ data: result.rows }, { status: 200 });
      } catch (error) {
        console.error('Fetch flair error:', error);
        return NextResponse.json({ error: 'Failed to fetch flair data' }, { status: 500 });
      }
    }

    
 
    

    

if (type === 'create_new_flair') {
      const { flairname } = body;

      if (!flairname) {
        return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
      }

      const flairid = generateRandomId(30);
      const query = `INSERT INTO flair (flairid, flairname) VALUES ($1, $2)`;
      await pool.query(query, [flairid, flairname]);

      return new Response(JSON.stringify({ message: 'Added' }), { status: 201 });
    }

    // ✅ Update flair
    if (type === 'update_flair') {
      const { flairid, flairname } = body;

      if (!flairid || !flairname) {
        return new Response(JSON.stringify({ error: 'Missing flairid or flairname' }), { status: 400 });
      }

      const query = `UPDATE flair SET flairname = $1 WHERE flairid = $2`;
      await pool.query(query, [flairname, flairid]);

      return new Response(JSON.stringify({ message: 'Updated' }), { status: 200 });
    }

    // ✅ Delete flair
  if (type === 'delete_flair') {
      const { flairid } = body;
      if (!flairid) {
        return new Response(JSON.stringify({ error: 'Missing flairid' }), { status: 400 });
      }

      const query = `DELETE FROM flair WHERE flairid = $1`;
      await pool.query(query, [flairid]);

      return new Response(JSON.stringify({ message: 'Deleted' }), { status: 200 });
    }



    // ✅ Search flair
    if (type === 'search_flair') {
      const { flairname } = body;

      const query = `SELECT * FROM flair WHERE flairname ILIKE $1`;
      const result = await pool.query(query, [`%${flairname}%`]);

      return new Response(JSON.stringify({ data: result.rows }), { status: 200 });
    }


    return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400 });
  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
