import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Geometry } from 'geojson';

@Entity('states') // Specify the name of the database table
export class StateEntitiy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 }) // Adjust the data type and length as needed
  name: string;

  @Column({ type: 'varchar', length: 255 }) // Adjust the data type and length as needed
  type: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Geometry',
    srid: 4326,
  })
  boundary: Geometry; // Define a PostGIS geometry column for state boundaries
}
