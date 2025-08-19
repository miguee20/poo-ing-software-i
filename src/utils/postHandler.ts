import { NextResponse } from 'next/server';
import { 
  Validator, 
  RequiredFieldsValidator, 
  TypeValidator, 
  TitleValidator, 
  DescriptionValidator, 
  AuthorValidator 
} from './validators';
import { DatabaseService } from './databaseService';

export class PostHandler {
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
  
  async handlePostCreation(payload: any): Promise<NextResponse> {
    try {      
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
        { error: 'Database operation failed', details: String(err) },
        { status: 500 }
      );
    }
  }
}