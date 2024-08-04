$(document).ready(function () {
  $("#inputCnpj").mask("00.000.000/0000-00");
  $("#inputTelefone").mask("(00) 00000-0000");
  $("#inputCep").mask("00.000-000");

  jQuery.validator.addMethod(
    "celular",
    function (value, element) {
      value = value.replace(/[()\s-]/g, "");
      if (value.length < 10 || value.length > 11) {
        return this.optional(element) || false;
      }
      return /^[6-9]/.test(value.substring(2, 3));
    },
    "Informe um número de telefone celular válido!"
  );

  $("#inputCep").blur(function () {
    var cep = $(this).val().replace(/\D/g, "");
    if (cep) {
      if (/^[0-9]{8}$/.test(cep)) {
        $.getJSON(
          "https://viacep.com.br/ws/" + cep + "/json/",
          function (data) {
            if (!("erro" in data)) {
              $("#inputEndereco").val(data.logradouro);
              $("#inputBairro").val(data.bairro);
              $("#inputMunicipio").val(data.localidade);
              $("#inputEstado").val(data.uf);
            } else {
              alert("CEP não encontrado.");
            }
          }
        ).fail(function () {
          alert("Erro ao buscar o CEP.");
        });
      } else {
        alert("Formato de CEP inválido.");
      }
    }
  });

  $("#formValidation").validate({
    debug: true,
    rules: {
      rsocial: { required: true, minlength: 3 },
      cnpj: { required: true, minlength: 14 },
      nomeFantasia: { required: true, minlength: 3 },
      cep: { required: true, minlength: 9 },
      endereco: { required: true },
      numero: { required: true, digits: true },
      bairro: { required: true },
      municipio: { required: true },
      estado: { required: true, minlength: 2 },
      contato: { required: true },
      telefone: { required: true, celular: true },
      email: { required: true, email: true },
    },
    messages: {
      rsocial: {
        required: "Por favor, insira a razão social.",
        minlength: "A razão social deve ter pelo menos 3 caracteres.",
      },
      cnpj: {
        required: "Por favor, insira o CNPJ.",
        minlength: "O CNPJ deve conter 14 caracteres.",
      },
      nomeFantasia: {
        required: "Por favor, insira o nome fantasia.",
        minlength: "O nome fantasia deve ter pelo menos 3 caracteres.",
      },
      inputCep: {
        required: "Campo obrigatório",
        cep: "Digite um CEP válido (XXXXX-XXX)",
      },
      endereco: { required: "Por favor, insira o endereço." },
      numero: {
        required: "Por favor, insira o número.",
        digits: "O número deve conter apenas dígitos.",
      },
      bairro: { required: "Por favor, insira o bairro." },
      municipio: { required: "Por favor, insira o município." },
      estado: {
        required: "Por favor, insira o estado.",
        minlength: "O estado deve ter pelo menos 2 caracteres.",
      },
      contato: { required: "Por favor, insira o nome da pessoa de contato." },
      telefone: { required: "Por favor, insira o telefone." },
      email: {
        required: "Por favor, insira o email.",
        email: "Por favor, insira um email válido.",
      },
    },
  });

  const produtosCard = document.querySelector("[data-produtos]");
  const adicionarProdutoButton = document.querySelector("#addproduto");

  let produtos = 0;
  const produtosArray = [];

  adicionarProdutoButton.addEventListener("click", (event) => {
    event.preventDefault();
    produtos++;
    const produtoHTML = `
          <div class="row mb-3" id="produto${produtos}">
              <div class="d-flex col-1 justify-content-center align-items-center">
                  <i class="bi bi-trash h2" id="removerProduto${produtos}" style="color: #da0000"></i>
              </div>
              <div class="col-11">
                  <div class="card">
                      <div class="card-header">Produto - ${produtos}</div>
                      <div class="card-body">
                          <div class="row">
                              <div class="d-flex col-1 align-items-center">
                                  <i class="bi bi-box-seam display-2"></i>
                              </div>
                              <div class="col-11">
                                  <div class="row row-cols-2">
                                      <div class="mb-3 col-12">
                                          <label for="produtoInput${produtos}" class="form-label">Produto</label>
                                          <input type="text" class="form-control" id="produtoInput${produtos}" />
                                      </div>
                                      <div class="mb-3 col-3">
                                          <label class="form-label">UND. Medida</label>
                                          <select class="form-select" id="medida${produtos}" required>
                                              <option>cm</option>
                                              <option>metro</option>
                                              <option>kg</option>
                                              <option>grama</option>
                                              <option>litro</option>
                                              <option>unidade</option>
                                              <option>x-não definido</option>
                                          </select>
                                      </div>
                                      <div class="mb-3 col-3">
                                          <label for="qntdEstoque${produtos}" class="form-label">QDTDE. em Estoque</label>
                                          <input type="number" class="form-control" id="qntdEstoque${produtos}" min="0" required />
                                      </div>
                                      <div class="mb-3 col-3">
                                          <label for="valorUnitario${produtos}" class="form-label">Valor Unitário</label>
                                          <input type="number" class="form-control" id="valorUnitario${produtos}" min="0" required />
                                      </div>
                                      <div class="mb-3 col-3">
                                          <fieldset disabled>
                                              <label for="valorTotalInput${produtos}" class="form-label">Valor Total</label>
                                              <input type="number" class="form-control" id="valorTotalInput${produtos}" required min="0" />
                                          </fieldset>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      `;

    produtosCard.insertAdjacentHTML("afterbegin", produtoHTML);

    const descricaoProduto = document.querySelector(`#produtoInput${produtos}`);
    const medida = document.querySelector(`#medida${produtos}`);
    const qntdEstoque = document.querySelector(`#qntdEstoque${produtos}`);
    const valorUnitario = document.querySelector(`#valorUnitario${produtos}`);
    const valorTotal = document.querySelector(`#valorTotalInput${produtos}`);

    const produtoObject = {
      indice: produtos,
      descricaoProduto: descricaoProduto.value,
      unidadeMedida: medida.value,
      qtdeEstoque: qntdEstoque.value,
      valorUnitario: valorUnitario.value,
      valorTotal: valorTotal.value,
    };

    produtosArray.push(produtoObject);

    qntdEstoque.addEventListener("change", () => {
      valorTotal.value = qntdEstoque.value * valorUnitario.value;
    });

    valorUnitario.addEventListener("change", () => {
      valorTotal.value = qntdEstoque.value * valorUnitario.value;
    });

    const removerProduto = document.querySelector(`#removerProduto${produtos}`);
    removerProduto.addEventListener("click", (event) => {
      event.preventDefault();
      const produtoId = Number(event.target.id.replace("removerProduto", ""));
      const produtoIndex = produtosArray.findIndex(
        (produto) => produto.indice === produtoId
      );
      if (produtoIndex !== -1) {
        produtosArray.splice(produtoIndex, 1);
        produtosCard.removeChild(
          document.querySelector(`#produto${produtoId}`)
        );
      }
    });

    const produtoDiv = document.querySelector(`#produto${produtos}`);
    produtoDiv.addEventListener("change", () => {
      const produtoId = Number(produtoDiv.id.replace("produto", ""));
      const produto = produtosArray.find(
        (produto) => produto.indice === produtoId
      );

      if (produto) {
        produto.descricaoProduto = descricaoProduto.value;
        produto.unidadeMedida = medida.value;
        produto.qtdeEstoque = qntdEstoque.value;
        produto.valorUnitario = valorUnitario.value;
        produto.valorTotal = valorTotal.value;
      }
    });
  });

  const anexosCard = document.querySelector("[data-anexos]");
  const fileInput = document.querySelector("#adicionarAnexo");
  const anexosFiles = {};
  const anexosArray = [];
  sessionStorage.setItem("anexos", JSON.stringify(anexosArray));
  let anexos = 0;

  fileInput.addEventListener("change", (event) => {
    event.preventDefault();
    anexos++;
    const file = event.target.files[0];

    if (file) {
      anexosFiles[anexos] = file;
      const blob = new Blob([file], { type: file.type });
      const url = window.URL.createObjectURL(blob);
      const anexoObject = {
        indice: anexos,
        nomeArquivo: file.name,
        blobArquivo: url,
      };
      anexosArray.push(anexoObject);
      sessionStorage.setItem("anexos", JSON.stringify(anexosArray));
      adicionarAnexo(file.name);
    }
  });

  function downloadFile(conteudo, nomeDoArquivo, tipoDoArquivo) {
    const a = document.createElement("a");
    document.body.appendChild(a);
    const blob = new Blob([conteudo], { type: tipoDoArquivo });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = nomeDoArquivo;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  function adicionarAnexo(nomeAnexo) {
    const anexoHTML = `
      <div class="row mt-3" id="anexo${anexos}">
        <div class="d-flex justify-content-center col-1">
          <i class="bi bi-trash h2" id="removerAnexo${anexos}"></i>
        </div>
        <div class="d-flex justify-content-center col-1">
          <i class="bi bi-eye-fill h2 black" id="baixarAnexo${anexos}"></i>
        </div>
        <div class="d-flex align-items-center col-10">
          ${nomeAnexo}
        </div>
      </div>
    `;

    anexosCard.insertAdjacentHTML("afterbegin", anexoHTML);

    const removerAnexo = document.querySelector(`#removerAnexo${anexos}`);
    removerAnexo.addEventListener("click", (event) => {
      event.preventDefault();
      const anexoId = Number(event.target.id.replace("removerAnexo", ""));
      const anexoIndex = anexosArray.findIndex(
        (anexo) => anexo.indice === anexoId
      );
      if (anexoIndex !== -1) {
        anexosArray.splice(anexoIndex, 1);
        sessionStorage.setItem("anexos", JSON.stringify(anexosArray));
        anexosCard.removeChild(document.querySelector(`#anexo${anexoId}`));
      }
    });

    const baixarAnexo = document.querySelector(`#baixarAnexo${anexos}`);
    baixarAnexo.addEventListener("click", (event) => {
      event.preventDefault();
      const anexoId = Number(event.target.id.replace("baixarAnexo", ""));
      const file = anexosFiles[anexoId];
      if (file) {
        downloadFile(file, file.name, file.type);
      }
    });
  }

  function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function validateForm() {
    let isValid = true;
    const requiredFields = [
      "#inputRsocial",
      "#inputCnpj",
      "#inputCep",
      "#inputEndereco",
      "#inputNumero",
      "#inputBairro",
      "#inputMunicipio",
      "#inputEstado",
      "#inputContato",
      "#inputTelefone",
      "#inputEmail",
    ];

    requiredFields.forEach((selector) => {
      const input = $(selector);
      if (input.val().trim() === "") {
        isValid = false;
        input.addClass("is-invalid");
      } else {
        input.removeClass("is-invalid");
      }
    });

    return isValid;
  }

  $("#submit-button").on("click", function (event) {
    event.preventDefault();

    if (validateForm()) {
      const formData = {
        fornecedor: {
          rsocial: $("#inputRsocial").val(),
          cnpj: $("#inputCnpj").val(),
          nomeFantasia: $("#inputNomeFant").val(),
          cep: $("#inputCep").val(),
          endereco: $("#inputEndereco").val(),
          numero: $("#inputNumero").val(),
          complemento: $("#inputComplemento").val(),
          bairro: $("#inputBairro").val(),
          municipio: $("#inputMunicipio").val(),
          estado: $("#inputEstado").val(),
          contato: $("#inputContato").val(),
          telefone: $("#inputTelefone").val(),
          email: $("#inputEmail").val(),
        },
        produtos: produtosArray,
      };

      $("#exampleModal").modal("show");
      $("#downloadJson").on("click", function () {
        downloadJSON(formData, "fornecedor.json");
      });
    } else {
      alert("Por favor, preencha todos os campos obrigatórios.");
    }
  });
});
