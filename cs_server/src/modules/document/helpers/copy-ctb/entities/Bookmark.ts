import { Column, Entity } from "typeorm";

@Entity("bookmark")
export class Bookmark {
  @Column("integer", { name: "node_id", nullable: true, unique: true })
  nodeId: number | null;

  @Column("integer", { name: "sequence", nullable: true })
  sequence: number | null;
}
