import postgres from 'postgres';
import { NextResponse, NextRequest } from 'next/server';

const validateFields = (data: any) => {
  if (!data || data.title === undefined || data.description === undefined || data.author === undefined) {
    return NextResponse.json(
      { error: 'Missing required fields', required: ['title', 'description', 'author'] },
      { status: 400 }
    );
  }
  return null;
};

const validateTypes = (data: any) => {
  const types = {
    title: typeof data.title,
    description: typeof data.description,
    author: typeof data.author
  };

  if (types.title !== 'string' || types.description !== 'string' || types.author !== 'string') {
    return NextResponse.json(
      { 
        error: 'Type validation failed',
        expected: 'All fields should be strings',
        received: types
      },
      { status: 400 }
    );
  }
  return null;
};

const validateTitle = (title: string) => {
  if (title.trim().length < 5 || title.trim().length > 100) {
    return NextResponse.json(
      { 
        error: 'Title must be between 5-100 characters',
        value: title,
        length: title.length
      },
      { status: 400 }
    );
  }
  return null;
};

const validateDescription = (description: string) => {
  const trimmedDesc = description.trim();
  
  if (!trimmedDesc) {
    return NextResponse.json(
      { 
        error: 'Description cannot be empty or just whitespace',
        value: description
      },
      { status: 400 }
    );
  }

  const minLength = 5;
  const maxLength = 1000;
  
  if (trimmedDesc.length < minLength) {
    return NextResponse.json(
      { 
        error: `Description too short (minimum ${minLength} characters required)`,
        value: description,
        currentLength: trimmedDesc.length,
        requiredMinimum: minLength,
        remainingCharacters: minLength - trimmedDesc.length
      },
      { status: 400 }
    );
  }

  if (trimmedDesc.length > maxLength) {
    return NextResponse.json(
      { 
        error: `Description too long (maximum ${maxLength} characters allowed)`,
        value: description,
        currentLength: trimmedDesc.length,
        characterLimit: maxLength,
        excessCharacters: trimmedDesc.length - maxLength
      },
      { status: 400 }
    );
  }

  return null;
};

const validateAuthor = (author: string) => {
  const issues: string[] = [];
  
  if (!/^[A-ZÁÉÍÓÚÑÜ]/.test(author)) {
    issues.push('Must start with capital letter');
  }

  if (/[^A-Za-záéíóúñü'\-. ]/.test(author)) {
    issues.push('Contains invalid characters');
  }

  if (!/^[A-ZÁÉÍÓÚÑÜ][a-záéíóúñü'\-.]*(?: [A-ZÁÉÍÓÚÑÜ][a-záéíóúñü'\-.]*)*$/.test(author)) {
    issues.push('Invalid name format (should be "FirstName LastName")');
  }

  if (author.replace(/[^a-záéíóúñü]/gi, '').length < 2) {
    issues.push('Name too short');
  }

  if (issues.length > 0) {
    return NextResponse.json(
      { 
        error: 'Author name validation failed',
        issues,
        value: author,
        suggestions: [
          'Use proper capitalization',
          'Only use letters, spaces, hyphens, and apostrophes',
          'Example: "Miguel-Salguero"'
        ]
      },
      { status: 400 }
    );
  }

  return null;
};

// main function
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    
    const fieldCheck = validateFields(payload);
    if (fieldCheck) return fieldCheck;

    const typeCheck = validateTypes(payload);
    if (typeCheck) return typeCheck;

    const titleCheck = validateTitle(payload.title);
    if (titleCheck) return titleCheck;

    const descCheck = validateDescription(payload.description);
    if (descCheck) return descCheck;

    const authorCheck = validateAuthor(payload.author);
    if (authorCheck) return authorCheck;

    console.log('Valid submission:', {
      title: payload.title,
      description: payload.description,
      author: payload.author
    });

    return NextResponse.json({
      success: true,
      message: 'All data is valid',
      submittedData: {
        title: payload.title,
        description: payload.description,
        author: payload.author
      }
    });

    const sql = postgres('postgresql://postgres.entsyipsaivdjxboyjxu:MIGUELss19@aws-1-us-east-2.pooler.supabase.com:6543/postgres');

  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid JSON payload', details: String(err) },
      { status: 400 }
    );
  }
}