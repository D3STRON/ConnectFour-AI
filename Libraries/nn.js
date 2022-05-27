
class NeuralNetwork{
    constructor(numI, numH, numE, numO)
    {
        if (numI instanceof NeuralNetwork) {
            this.input_nodes = numI.input_nodes;
            this.hidden_nodes = numI.hidden_nodes;
            this.edge_nodes = numI.edge_nodes;
            this.output_nodes = numI.output_nodes;
      
            this.weight_ih = numI.weight_ih.copy();
            this.weight_he = numI.weight_he.copy();
            this.weight_eo = numI.weight_eo.copy();
      
            this.bias_h = numI.bias_h.copy();
            this.bias_e = numI.bias_e.copy();
            this.bias_o = numI.bias_o.copy();
            this.activation= numI.activation
            this.delta_activation= numI.delta_activation
        } 
        else {
            this.input_nodes=numI 
            this.hidden_nodes=numH
            this.edge_nodes=numE
            this.output_nodes=numO
            this.weight_ih= new Matrix(this.hidden_nodes,this.input_nodes)// the list of weights between input nodes and hidden nodes in this adjacency matrix
            this.weight_ih.randomize()// all weights will be random to begin with
            this.weight_he= new Matrix(this.edge_nodes,this.hidden_nodes)// the list of weights between hiden nodes and edge nodes in this adjacency matrix
            this.weight_he.randomize()
            this.weight_eo=new Matrix(this.output_nodes,this.edge_nodes)//the list of weights between edge nodes and output nodes in this adjacency matrix
            this.weight_eo.randomize()
            this.bias_h= new Matrix(this.hidden_nodes,1)
            this.bias_h.randomize()
            this.bias_e=new Matrix(this.edge_nodes,1)
            this.bias_e.randomize()
            this.bias_o=new Matrix(this.output_nodes,1)
            this.bias_o.randomize()
            this.learning_rate= 0.1
            this.activation = sigmoid
            this.delta_activation= dsigmoid
          }
    }

    feedforward(input_array)
    {
        this.hidden= Matrix.multiply(this.weight_ih,input_array)
        this.hidden.add(this.bias_h)//output of the weighted sum plus bias
        this.hidden.map(this.activation)// finally pass that outputs at every hidden node through the activation function to get the hidden layers final output
        
        this.edge=Matrix.multiply(this.weight_he,this.hidden)//simialar for the final output layer for which the hidden layer is the input
        this.edge.add(this.bias_e)
        this.edge.map(this.activation)

        let output=Matrix.multiply(this.weight_eo,this.edge)//simialar for the final output layer for which the hidden layer is the input
        output.add(this.bias_o)
        output.map(this.activation)

        return output
    }

    mutate(rate) {
        function mutate(val)
        {
            if(Math.random()<rate)
            {
                return val +randomGaussian(0, 0.1)
            }else{
                return val
            }
        }      
        this.weight_ih.map(mutate);
        this.weight_he.map(mutate);
        this.weight_eo.map(mutate);
        this.bias_h.map(mutate);
        this.bias_e.map(mutate);
        this.bias_o.map(mutate);
  }
  copy()
  {
      return new NeuralNetwork(this)
  }
}

function sigmoid(x)
{
   return 1/(1+Math.exp(-x))
}

function dsigmoid(y)
{
    return y*(1-y)
}

function tanh(x)
{
    return Math.tanh(x)
}

function dtanh(y)
{
    return 1-y*y
}

function taninv(x)
{
    return Math.atan(x)
}

function dtaninv(y)
{
    return 1/(1+y*y)
}

function reLU(x)
{
    if(x>=0)
    {
        return x

    }
    return 0
}