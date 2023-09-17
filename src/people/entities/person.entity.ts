import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Geometry } from 'geojson';

@Entity('people') // Specify the name of the database table
export class PersonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 }) // Adjust the data type and length as needed
  first_name: string;

  @Column({ type: 'varchar', length: 255 }) // Adjust the data type and length as needed
  last_name: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location: Geometry; // Define a PostGIS geometry column for state boundaries
}
