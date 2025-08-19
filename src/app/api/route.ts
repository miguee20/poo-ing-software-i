import postgres from 'postgres';
import { NextResponse, NextRequest } from 'next/server';

abstract class Validator {
  abstract validate(data: any): NextResponse | null;
}

class RequiredFieldsValidator extends Validator {
  private requiredFields: string[];
  
  constructor(fields: string[]) {
    super();
    this.requiredFields = fields;
  }
  
  validate(data: any): NextResponse | null {
    const missingFields = this.requiredFields.filter(field => data[field] === undefined);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Missing required fields', 
          missing: missingFields,
          required: this.requiredFields 
        },
        { status: 400 }
      );
    }
    return null;
  }
}

class TypeValidator extends Validator {
  private expectedTypes: Record<string, string>;
  
  constructor(expectedTypes: Record<string, string>) {
    super();
    this.expectedTypes = expectedTypes;
  }
  
  validate(data: any): NextResponse | null {
    const typeErrors: Record<string, string> = {};
    
    Object.keys(this.expectedTypes).forEach(field => {
      if (typeof data[field] !== this.expectedTypes[field]) {
        typeErrors[field] = `Expected ${this.expectedTypes[field]}, got ${typeof data[field]}`;
      }
    });
    
    if (Object.keys(typeErrors).length > 0) {
      return NextResponse.json(
        { 
          error: 'Type validation failed',
          details: typeErrors
        },
        { status: 400 }
      );
    }
    return null;
  }
}

class TitleValidator extends Validator {
  validate(title: string): NextResponse | null {
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
  }
}

class DescriptionValidator extends Validator {
  private minLength: number;
  private maxLength: number;
  
  constructor(minLength = 5, maxLength = 1000) {
    super();
    this.minLength = minLength;
    this.maxLength = maxLength;
  }
  
  validate(description: string): NextResponse | null {
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
    
    if (trimmedDesc.length < this.minLength) {
      return NextResponse.json(
        { 
          error: `Description too short (minimum ${this.minLength} characters required)`,
          value: description,
          currentLength: trimmedDesc.length,
          requiredMinimum: this.minLength,
          remainingCharacters: this.minLength - trimmedDesc.length
        },
        { status: 400 }
      );
    }

    if (trimmedDesc.length > this.maxLength) {
      return NextResponse.json(
        { 
          error: `Description too long (maximum ${this.maxLength} characters allowed)`,
          value: description,
          currentLength: trimmedDesc.length,
          characterLimit: this.maxLength,
          excessCharacters: trimmedDesc.length - this.maxLength
        },
        { status: 400 }
      );
    }

    return null;
  }
}

class AuthorValidator extends Validator {
  validate(author: string): NextResponse | null {
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
  }
}

class DatabaseService {
  private sql: any;
  
  constructor(connectionString: string) {
    this.sql = postgres(connectionString);
  }
  
  async insertPost(title: string, description: string, author: string): Promise<void> {
    await this.sql`INSERT INTO "POST-DB" (title, description, author) VALUES (${title}, ${description}, ${author})`;
  }
  
  disconnect(): void {
    this.sql.end();
  }
}

class PostHandler {
  private validators: Validator[];
  private dbService: DatabaseService;
  
  constructor(dbConnectionString: string) {
    this.validators = [
      new RequiredFieldsValidator(['title', 'description', 'author']),
      new TypeValidator({
        title: 'string',
        description: 'string',
        author: 'string'
      }),
      new TitleValidator(),
      new DescriptionValidator(),
      new AuthorValidator()
    ];
    
    this.dbService = new DatabaseService(dbConnectionString);
  }
  
  async handleRequest(req: NextRequest): Promise<NextResponse> {
    try {
      const payload = await req.json();
      
      for (const validator of this.validators) {
        const result = validator.validate(payload);
        if (result) return result;
      }
      
      await this.dbService.insertPost(payload.title, payload.description, payload.author);
      console.log('Data inserted successfully');

      return NextResponse.json({
        success: true,
        message: 'Data saved successfully',
        data: {
          title: payload.title,
          description: payload.description,
          author: payload.author
        }
      });

    } catch (err) {
      console.error('Error:', err);
      return NextResponse.json(
        { error: 'Invalid request', details: String(err) },
        { status: 400 }
      );
    }
  }
}

const connectionString = 'postgresql://postgres.entsyipsaivdjxboyjxu:MIGUELss19@aws-1-us-east-2.pooler.supabase.com:6543/postgres';
const postHandler = new PostHandler(connectionString);

export async function POST(req: NextRequest) {
  return postHandler.handleRequest(req);
}