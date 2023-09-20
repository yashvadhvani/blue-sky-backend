import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Geometry } from 'geojson';
import { PEOPLE } from '../../constants';

@Entity(PEOPLE)
export class PersonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  first_name: string;

  @Column({ type: 'varchar', length: 255 })
  last_name: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location: Geometry;
}
