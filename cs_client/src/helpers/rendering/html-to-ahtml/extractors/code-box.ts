const extractCodeBox = (acc, el, commonAttributes, options) => {
  acc.push(
    options.serializeNonTextElements
      ? {
          ...commonAttributes,
          type: 'code',
          outerHTML: el.outerHTML,
        }
      : {
          type: 'code',
          _: Array.from((el as HTMLDivElement).children)
            .map(el => (el as HTMLElement).innerText)
            .join('\n'),
          style: {
            height: el.style['min-height'], ///(^\d+)/.exec(el.style['min-height'])[1],
          },
          other_attributes: {
            // offset: state.offset++,
            is_width_pix: +el.dataset.is_width_pix,
            do_highl_bra: +el.dataset.do_highl_bra,
            width_raw: +el.dataset.width_raw,
            syntax: el.dataset.syntax,
            do_show_linenum: el.dataset.do_show_linenum,
          },
        },
  );
};

export { extractCodeBox };
