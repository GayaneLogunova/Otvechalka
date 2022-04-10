from transformers import pipeline

PATH = "neural_network/test-squad-trained/"

class NeuralNetwork:
    def __init__(self, path):
        self.question_answering = pipeline("question-answering",
            model=path,
            tokenizer="DeepPavlov/rubert-base-cased",
        )

    def load_text(self, text):
        self.context = text
        return True

    def get_context(self):
        return self.context

    def get_answer(self, question):
        result = self.question_answering(question=question, context=self.context, topk=5)
        print("result", result)
        answers = map(lambda el: [el['answer'], el['score']], result)
        return answers

# question_answering = pipeline("question-answering",
#     model=PATH,
#     tokenizer="DeepPavlov/rubert-base-cased")

# context = """
# Я ехал на перекладных из Тифлиса. Вся поклажа моей тележки состояла из одного небольшого чемодана, который до половины был набит путевыми записками о Грузии. Большая часть из них, к счастию для вас, потеряна, а чемодан с остальными вещами, к счастью для меня, остался цел.
# Уж солнце начинало прятаться за снеговой хребет, когда я въехал в Койшаурскую долину. Осетин-извозчик неутомимо погонял лошадей, чтоб успеть до ночи взобраться на Койшаурскую гору, и во все горло распевал песни. Славное место эта долина! Со всех сторон горы неприступные, красноватые скалы, обвешанные зеленым плющом и увенчанные купами чинар, желтые обрывы, исчерченные промоинами, а там высоко-высоко золотая бахрома снегов, а внизу Арагва, обнявшись с другой безыменной речкой, шумно вырывающейся из черного, полного мглою ущелья, тянется серебряною нитью и сверкает, как змея своею чешуею.
# """

# question = "Что было в чемодане?"

# result = question_answering(question=question, context=context)

# print("Answer:", result['answer'])
# print("Score:", result['score'])
# model.load_state_dict(torch.load(PATH))
# model.eval()