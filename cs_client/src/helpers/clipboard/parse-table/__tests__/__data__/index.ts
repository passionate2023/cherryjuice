import { toNodes } from '::helpers/execK/helpers';

const t1 = `<table role="presentation">
<tbody>
  <tr>
    <td style="padding:0 0.9em 0 0; width:350px;">
<img
  src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Johannes_Vermeer%2C_Allegory_of_the_Catholic_Faith%2C_The_Metropolitan_Museum_of_Art.jpg/350px-Johannes_Vermeer%2C_Allegory_of_the_Catholic_Faith%2C_The_Metropolitan_Museum_of_Art.jpg"
  />
  </td>
  <td style="padding:0 6px 0 0">
  <p>The Allegory of Faith</p>
<p>Painting credit: Johannes Vermeer</p>
</td>
</tr>
</tbody>
</table>`;

const t2 = `<table class="rich-text__table" data-col_max_width="600" data-col_min_width="40" style="; }">
      <thead>
        <tr><th>name</th><th>age</th><th>best series</th>
      </tr></thead>
      <tbody>
        <tr>
            <td>yacine</td><td>26</td><td>bb</td>
          </tr><tr>
            <td>kamel</td><td>27</td><td>got</td>
          </tr><tr>
            <td></td><td></td><td></td>
          </tr><tr>
            <td></td><td></td><td></td>
          </tr><tr>
            <td></td><td></td><td></td>
          </tr><tr>
            <td>hachemi</td><td>26</td><td>mad men</td>
          </tr><tr>
            <td></td><td></td><td></td>
          </tr><tr>
            <td></td><td></td><td></td>
          </tr><tr>
            <td>amine</td><td>26</td><td>quraych 2</td>
          </tr>
      </tbody>
    </table>`;

const testSamples = [
  {
    meta: { name: 'table with images and links' },
    input: { table: t1 },
    output: {
      elements: [
        `<br>`,
        `<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Johannes_Vermeer%2C_Allegory_of_the_Catholic_Faith%2C_The_Metropolitan_Museum_of_Art.jpg/350px-Johannes_Vermeer%2C_Allegory_of_the_Catholic_Faith%2C_The_Metropolitan_Museum_of_Art.jpg">`,
        `<p>The Allegory of Faith</p>`,
        `<p>Painting credit: Johannes Vermeer</p>`,
      ].map(toNodes),
      presentational: true,
    },
  },
  {
    meta: { name: 'cherrytree table' },
    input: { table: t2 },
    output: {
      elements: [],
      presentational: false,
    },
  },
];

export { testSamples };
