import { Column, Entity } from "typeorm";

@Entity("children")
export class Children {
  @Column("integer", { name: "node_id", nullable: true, unique: true })
  nodeId: number | null;

  @Column("integer", { name: "father_id", nullable: true })
  fatherId: number | null;

  @Column("integer", { name: "sequence", nullable: true })
  sequence: number | null;
}
