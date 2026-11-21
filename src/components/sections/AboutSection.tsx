/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Target, Eye, Shield, History, Award, BookOpen, Compass, CheckCircle, Users, User, Mail } from 'lucide-react';
import comunidadUnionImg from '../../assets/images/comunidad_union_1782499241517.jpg';
import AdaptiveImage from '../AdaptiveImage';

export default function AboutSection() {
  const values = [
    { title: 'Dignidad Humana', desc: 'Respeto absoluto por el valor intrínseco y los derechos de cada persona, sin discriminación.' },
    { title: 'Solidaridad', desc: 'Compromiso genuino con las familias de escasos recursos y las víctimas de la violencia.' },
    { title: 'Transparencia', desc: 'Rendición de cuentas clara en el manejo de aportes y en las asesorías radicadas.' },
    { title: 'Justicia Social', desc: 'Búsqueda del bienestar colectivo y del cumplimiento estricto del derecho civil y humano.' },
  ];

  const juntaDirectiva: Array<{ nombre: string; cargo: string; correo: string; imagen?: string }> = [
    { nombre: 'Robinson Porras', cargo: 'PRESIDENTE', correo: 'robinsonporras@fundelibertad.org', imagen: 'https://lh3.googleusercontent.com/d/1KdDJzQ71_LubeM9HSgO5Zpbyko4Q95iJ' },
    { nombre: 'Harold Porras', cargo: 'TESORERO', correo: 'haroldporras@fundelibertad.org', imagen: 'https://lh3.googleusercontent.com/d/1YZ-vw06ytJra9HIv3LCxC65STJGUWZEu' },
    { nombre: 'Ismael Porras', cargo: 'SUPLENTE PRESIDENTE', correo: 'ismaelporras@fundelibertad.org', imagen: 'https://lh3.googleusercontent.com/d/1ygzGpANHxByOhw7-u86DmqhyXhl2Thz4' },
    { nombre: 'Sandra Porras', cargo: 'SUPLENTE SECRETARIA', correo: 'sandraporras@fundelibertad.org', imagen: 'https://lh3.googleusercontent.com/d/1fbHlg8HJ_em_hE-ysT3KBoKWWGlV1c9g' },
    { nombre: 'Jorge Cardona', cargo: 'SUPLENTE TESORERO', correo: 'jorgecardona@fundelibertad.org', imagen: 'https://lh3.googleusercontent.com/d/1UpCstBYb2vnm55j28vvfFdBvWx1UnCxb' },
  ];

  return (
    <div className="space-y-16 pb-16 font-sans text-left" id="about-section-container">
      {/* Introduction banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <span className="text-xs font-bold text-sky-800 uppercase tracking-widest block">Nosotros</span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-brand-dark tracking-tight leading-none">
            Fundación de Derechos Humanos por la Libertad y la Vida
          </h1>
          <div className="w-16 h-1 bg-brand-green rounded-full" />
          
          <p className="text-sm text-slate-600 leading-relaxed">
            Somos una Fundación que ha desarrollado un intenso trabajo durante los últimos 15 años en pro de la paz, para acompañar el posconflicto y para apoyar a las familias de menos recursos.
          </p>

        </div>

        <AdaptiveImage
          src={comunidadUnionImg}
          alt="Comunidad unida - Manos en círculo sobre el césped"
          containerClassName="relative rounded-2xl overflow-hidden h-[320px] bg-white border border-slate-200/80 shadow-xs flex items-center justify-center"
        />
      </div>

      {/* History block */}
      <section className="space-y-6" id="history-segment">
        <div className="flex items-center gap-2">
          <History className="w-6 h-6 text-brand-green" />
          <h2 className="font-display font-bold text-xl text-brand-dark uppercase tracking-wide">Nuestra Historia</h2>
        </div>
        <div className="bg-slate-50/50 p-6 sm:p-8 rounded-2xl border border-slate-100 text-sm text-slate-600 space-y-4 leading-relaxed">
          <p>
            FUNDELIBERTAD es una organización sin ánimo de lucro, legalmente constituida en Colombia, comprometida con la promoción, protección y defensa de los derechos humanos, el fortalecimiento del acceso a la justicia y el desarrollo integral de las comunidades.
          </p>
          <p>
            La Fundación trabaja por la construcción de una sociedad más justa, solidaria, incluyente y respetuosa de la dignidad humana, desarrollando programas orientados a la protección de la niñez, la adolescencia y la juventud; la prevención del consumo de sustancias psicoactivas, la violencia y la delincuencia; la promoción de la educación, el deporte y la participación ciudadana; y la orientación jurídica a personas y comunidades en condición de vulnerabilidad.
          </p>
          <p>
            FUNDELIBERTAD cree que el desarrollo social solo es posible cuando las personas conocen sus derechos, participan activamente en la vida democrática y cuentan con oportunidades para construir un proyecto de vida digno.
          </p>
          <p>
            Por ello, promueve alianzas con entidades públicas, privadas, organizaciones sociales, universidades y organismos nacionales e internacionales para impulsar iniciativas sostenibles que contribuyan al bienestar colectivo.
          </p>
          <p>
            Nuestra labor se fundamenta en los principios de legalidad, transparencia, independencia, responsabilidad social, solidaridad, participación ciudadana, inclusión y respeto por la dignidad humana.
          </p>
          <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-display font-bold text-slate-900 mb-2 uppercase tracking-wide">OBJETIVO GENERAL:</h4>
              <p>
                Contribuir al desarrollo integral de la niñez, la juventud y las familias mediante programas de prevención del consumo de drogas y la delincuencia, acceso a la justicia, educación, deporte y promoción de los derechos humanos.
              </p>
            </div>
            <div>
              <h4 className="font-display font-bold text-slate-900 mb-2 uppercase tracking-wide">NUESTRO COMPROMISO:</h4>
              <p>
                FUNDELIBERTAD reafirma su compromiso con la construcción de una sociedad donde cada niño, adolescente, joven y familia tenga acceso a oportunidades de desarrollo, educación, deporte, orientación jurídica y protección de sus derechos. La Fundación trabaja para fortalecer la convivencia pacífica, prevenir la violencia y promover una cultura de legalidad y participación ciudadana, convencida de que el desarrollo sostenible solo es posible cuando se respetan plenamente los derechos y libertades de todas las personas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6" id="mission-vision-segment">
        {/* Mission */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-brand-primary">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="font-display font-black text-xl text-brand-dark tracking-tight">Misión</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Promover, proteger y defender los derechos humanos mediante programas de prevención, educación, acceso a la justicia, desarrollo comunitario y fortalecimiento de la niñez, la adolescencia y la juventud, contribuyendo a la construcción de comunidades seguras, participativas y comprometidas con el respeto de la dignidad humana, la convivencia pacífica y el Estado de Derecho.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-brand-green">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="font-display font-black text-xl text-brand-dark tracking-tight">Visión</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Para el año 2032, FUNDELIBERTAD será reconocida como una organización líder en Colombia y un referente en América Latina por su compromiso con la defensa de los derechos humanos, la protección de la niñez y la juventud, el acceso a la justicia y el desarrollo comunitario, destacándose por la transparencia en su gestión, la innovación social y la ejecución de proyectos de alto impacto en alianza con organismos nacionales e internacionales.
          </p>
        </div>
      </section>

      {/* Junta Directiva Block */}
      <section className="bg-white rounded-2xl p-8 border border-slate-100 shadow-xs space-y-6" id="junta-directiva-segment">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-brand-primary" />
          <h3 className="font-display font-bold text-lg text-brand-dark uppercase tracking-wide">Junta Directiva</h3>
        </div>
        <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
          Nuestra Junta Directiva está conformada por profesionales comprometidos y de amplia trayectoria, encargados de guiar las decisiones estratégicas de FUNDELIBERTAD bajo principios de ética, transparencia y defensa de los Derechos Humanos.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
          {juntaDirectiva.map((member, index) => (
            <div key={index} className="flex flex-col items-center text-center p-5 bg-slate-50/50 rounded-2xl border border-slate-100 shadow-2xs space-y-4 hover:shadow-xs transition-all duration-300">
              {/* Photo placeholder / avatar */}
              <div className="relative w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden">
                {member.imagen ? (
                  <img
                    src={member.imagen}
                    alt={member.nombre}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="w-8 h-8 text-slate-400" />
                )}
              </div>
              
              <div className="space-y-1 w-full flex-grow">
                <h4 className="font-display font-bold text-xs text-slate-900 tracking-tight leading-tight line-clamp-2 min-h-[2rem] flex items-center justify-center">
                  {member.nombre}
                </h4>
                <p className="text-[10px] font-semibold text-brand-green uppercase tracking-wider">
                  {member.cargo}
                </p>
              </div>
              
              <div className="pt-2 w-full border-t border-slate-100 mt-auto">
                <a 
                  href={`mailto:${member.correo}`} 
                  className="inline-flex items-center justify-center gap-1 text-[9px] text-slate-500 hover:text-brand-primary transition-colors w-full"
                >
                  <Mail className="w-3 h-3 shrink-0" />
                  <span className="truncate max-w-[120px]" title={member.correo}>
                    {member.correo}
                  </span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values Grid */}
      <section className="space-y-8" id="values-segment">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-sky-800 uppercase tracking-widest block">Nuestros Pilares</span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-brand-dark tracking-tight">
            Valores Institucionales
          </h2>
          <div className="w-12 h-1 bg-brand-green mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div key={i} className="p-6 bg-white rounded-xl border border-slate-100 shadow-xs space-y-2">
              <CheckCircle className="w-5 h-5 text-brand-green" />
              <h4 className="font-display font-extrabold text-sm text-slate-950">{v.title}</h4>
              <p className="text-xs text-slate-500 leading-normal">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Institutional Commitment */}
      <section className="p-8 bg-sky-50/50 rounded-2xl border border-sky-100 space-y-4" id="commitment-segment">
        <h3 className="font-display font-black text-lg text-slate-900">Compromiso Institucional con la Paz</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Nuestra labor en Medellín trasciende las aulas y las oficinas. Nos comprometemos activamente a acompañar el desarrollo territorial, impulsando diálogos restaurativos y brindando asesoría de primera mano a las víctimas del conflicto. FUNDELIBERTAD no es solo una sigla jurídica; es un testimonio de fe en el potencial humano y en la paz como el único camino viable para las futuras generaciones de colombianos.
        </p>
      </section>
    </div>
  );
}
