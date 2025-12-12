export default function TableauMassages() {
  return (
    <div className="prestationsSection table-responsive-xl">
      <table className="color-printable table table-bordered tableauMassages tailleGrande">
        <caption>
          <div className="legende">
            <strong>Légende :</strong>
            <ul className="liste-legende">
              <li>
                <img
                  className="tenueIcon"
                  src="https://www.massagerecu.fr/assets/img/massages/tshirt.svg"
                  alt="Tenue habillée décontractée"
                />{" "}
                Massage habillé
              </li>
              <li>
                <img
                  className="tenueIcon"
                  src="https://www.massagerecu.fr/assets/img/massages/string.svg"
                  alt="Tenue dénudée couverte"
                />{" "}
                Massage en sous-vêtement
              </li>
            </ul>
          </div>
        </caption>
        <thead className="theadRecapMassages">
          <tr>
            <th className="colonneMassage" scope="col"></th>
            <th className="colonnePression" scope="col">
              Pression
            </th>
            <th className="colonneTenue" scope="col">
              Tenue
            </th>
            <th className="colonnePrix" scope="col">
              45'
            </th>
            <th className="colonnePrix" scope="col">
              1h
            </th>
            <th className="colonnePrix" scope="col">
              1h30
            </th>
            <th className="colonnePrix" scope="col">
              2h
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className="massage_cat" colSpan={7} scope="colgroup">
              Massages complets
            </th>
          </tr>
          <tr>
            <td className="colonneMassage">
              <div className="titreMassage">
                <div className="texteTitreMassage maTooltip">
                  <img
                    className="massage_icon"
                    src="https://www.massagerecu.fr/assets/img/massages/icone_indien.png"
                  />
                  Massage Indien
                  <div className="textDescriptionMassage maTooltipTexte">
                    Fluide, harmonieux
                  </div>
                </div>
              </div>
            </td>
            <td className="pressionContainer maTooltip">
              <div className="circle pression1"></div>
              <div className="circle pression2"></div>
              <div className="circle pression3"></div>
              <div className="circle"></div>
              <div className="pressionTexte maTooltipTexte">
                Légère à Appuyée
              </div>
            </td>
            <td>
              <img
                className="tenueIcon"
                src="https://www.massagerecu.fr/assets/img/massages/string.svg"
                alt="Tenue nudité couverte ou sous-vêtement"
              />
            </td>
            <td></td>
            <td>60 €</td>
            <td>80 €</td>
            <td>
              100 €
              <div className="textExtraPrixMassage">
                (Massage 1h30 + Réflexologie 30min)
              </div>
            </td>
          </tr>
          <tr>
            <td className="colonneMassage">
              <div className="titreMassage">
                <div className="texteTitreMassage maTooltip">
                  <img
                    className="massage_icon"
                    src="https://www.massagerecu.fr/assets/img/massages/icone_balinais.png"
                  />
                  Massage Balinais
                  <div className="textDescriptionMassage maTooltipTexte">
                    Drainant, musculaire
                  </div>
                </div>
              </div>
            </td>
            <td className="pressionContainer maTooltip">
              <div className="circle"></div>
              <div className="circle pression2"></div>
              <div className="circle pression3"></div>
              <div className="circle"></div>
              <div className="pressionTexte maTooltipTexte">
                Modérée à Appuyée
              </div>
            </td>
            <td>
              <img
                className="tenueIcon"
                src="https://www.massagerecu.fr/assets/img/massages/string.svg"
                alt="Tenue nudité couverte ou sous-vêtement"
              />
            </td>
            <td></td>
            <td>60 €</td>
            <td>80 €</td>
            <td>
              100 €
              <div className="textExtraPrixMassage">
                (Massage 1h30 + Réflexologie 30min)
              </div>
            </td>
          </tr>

          <tr>
            <td className="colonneMassage">
              <div className="titreMassage">
                <div className="texteTitreMassage maTooltip">
                  <img
                    className="massage_icon"
                    src="https://www.massagerecu.fr/assets/img/massages/icone_thailandais.png"
                  />
                  Massage Thaïlandais huilé
                  <div className="textDescriptionMassage maTooltipTexte">
                    Dynamique, appuyé
                  </div>
                </div>
              </div>
            </td>
            <td className="pressionContainer maTooltip">
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle pression3"></div>
              <div className="circle pression4"></div>
              <div className="pressionTexte maTooltipTexte">
                Appuyée à Intense
              </div>
            </td>
            <td>
              <img
                className="tenueIcon"
                src="https://www.massagerecu.fr/assets/img/massages/string.svg"
                alt="Tenue nudité couverte ou sous-vêtement"
              />
            </td>
            <td></td>
            <td>60 €</td>
            <td>80 €</td>
            <td>
              100 €
              <div className="textExtraPrixMassage">
                (Massage 1h30 + Réflexologie 30min)
              </div>
            </td>
          </tr>

          <tr>
            <td className="colonneMassage">
              <div className="titreMassage">
                <div className="texteTitreMassage maTooltip">
                  <img
                    className="massage_icon"
                    src="https://www.massagerecu.fr/assets/img/massages/icone_japonais.png"
                  />
                  Shiatsu détente
                  <div className="textDescriptionMassage maTooltipTexte">
                    Pressions en profondeur, calme
                  </div>
                </div>
              </div>
            </td>
            <td className="pressionContainer maTooltip">
              <div className="circle"></div>
              <div className="circle pression2"></div>
              <div className="circle pression3"></div>
              <div className="circle"></div>
              <div className="pressionTexte maTooltipTexte">
                Modérée à Appuyée
              </div>
            </td>
            <td>
              <div className="tenueContainer">
                <img
                  className="tenueIcon"
                  src="https://www.massagerecu.fr/assets/img/massages/string.svg"
                  alt="Tenue nudité couverte ou sous-vêtement"
                />
                <div className="choixTenue">/</div>
                <img
                  className="tenueIcon"
                  src="https://www.massagerecu.fr/assets/img/massages/tshirt.svg"
                  alt="Tenue habillée décontractée"
                />
              </div>
            </td>
            <td></td>
            <td></td>
            <td>80 €</td>
            <td>
              100 €
              <div className="textExtraPrixMassage">
                (Massage 1h30 + Réflexologie 30min)
              </div>
            </td>
          </tr>

          <tr>
            <th className="massage_cat" colSpan={7} scope="colgroup">
              Massages spécifiques
            </th>
          </tr>

          <tr>
            <td className="colonneMassage">
              <div className="titreMassage">
                <div className="texteTitreMassage maTooltip">
                  <img
                    className="massage_icon"
                    src="https://www.massagerecu.fr/assets/img/massages/icone_ciblé.png"
                  />
                  Massage ciblé
                  <div className="textDescriptionMassage maTooltipTexte">
                    Massage d'une face ou de 2-3 zones
                  </div>
                </div>
              </div>
            </td>
            <td className="pressionContainer maTooltip">
              <div className="pressionCircles">
                <div className="circle pression1"></div>
                <div className="circle pression2"></div>
                <div className="circle pression3"></div>
                <div className="circle"></div>
              </div>
              <div className="pressionTexte maTooltipTexte">
                Légère à Appuyée
              </div>
            </td>
            <td>
              <div className="tenueContainer">
                <img
                  className="tenueIcon"
                  src="https://www.massagerecu.fr/assets/img/massages/string.svg"
                  alt="Tenue nudité couverte ou sous-vêtement"
                />
                <div className="choixTenue">/</div>
                <img
                  className="tenueIcon"
                  src="https://www.massagerecu.fr/assets/img/massages/tshirt.svg"
                  alt="Tenue habillée décontractée"
                />
              </div>
            </td>
            <td>50 €</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

          <tr>
            <td className="colonneMassage">
              <div className="titreMassage">
                <div className="texteTitreMassage maTooltip">
                  <img
                    className="massage_icon"
                    src="https://www.massagerecu.fr/assets/img/massages/icone_pieds.png"
                  />
                  Réflexologie plantaire
                  <div className="textDescriptionMassage maTooltipTexte">
                    Le massage traditionnel des pieds
                  </div>
                </div>
              </div>
            </td>
            <td className="pressionContainer maTooltip">
              <div className="circle"></div>
              <div className="circle pression2"></div>
              <div className="circle pression3"></div>
              <div className="circle pression4"></div>
              <div className="pressionTexte maTooltipTexte">
                Modérée à Intense
              </div>
            </td>
            <td>
              <img
                className="tenueIcon"
                src="https://www.massagerecu.fr/assets/img/massages/tshirt.svg"
                alt="Tenue habillée décontractée"
              />
            </td>
            <td>50 €</td>
            <td>60 €</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
