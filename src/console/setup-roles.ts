import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { RolesService } from '../roles/roles.service';
import { AppService } from '../app.service';

async function parseCSV(filePath: string): Promise<any[]> {
  const results: any[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data: any) => {
        results.push(data);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error: any) => {
        reject(error);
      });
  });
}

async function bootstrap() {
  const application = await NestFactory.createApplicationContext(AppModule);

  try {
    let csvFilePath = __dirname + '/../../import_csv_files/roles.csv';
    const parsedData = await parseCSV(csvFilePath);
    for (const value of parsedData) {
      await processValue(application, value);
    }
  } catch (error) {
    console.error('Error al parsear el archivo CSV:', error);
  }

  await application.close();
  process.exit(0);
}

async function processValue(application, value) {
  const rolService = application.get(RolesService);
  await rolService
    .create({
      name: value.name,
    })
    .then((pt) => {
      console.log(pt);
    })
    .catch((e) => {
      console.log(e);
    });
}

bootstrap();
