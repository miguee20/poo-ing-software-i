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
      
      for (const validator of [this.validators[0], this.validators[1]]) {
        const result = validator.validate(payload);
        if (result) return result;
      }
      
      
      const titleResult = this.validators[2].validate(payload.title);
      if (titleResult) return titleResult;
      
      const descResult = this.validators[3].validate(payload.description);
      if (descResult) return descResult;
      
      const authorResult = this.validators[4].validate(payload.author);
      if (authorResult) return authorResult;
      
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