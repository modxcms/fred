<?php
/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Default English Lexicon Entries for Fred
 *
 * @package fred
 * @subpackage lexicon
 */

$_lang['fred'] = 'Fred';

$_lang['fred.global.any'] = 'Любой';
$_lang['fred.global.change_order'] = 'Изменить заказ: [[+name]]';

$_lang['fred.open_in_fred'] = 'Открыть в Fred';

$_lang['fred.menu.blueprints'] = 'Макеты';
$_lang['fred.menu.blueprints_desc'] = 'Управление макетами и их категориями.';
$_lang['fred.refresh'] = 'Перестроение ресурсов Fred';
$_lang['fred.refresh_desc'] = 'Перестроение ресурсов с использованием шаблонов Fred';

$_lang['fred.refresh_fail_resource'] = 'Нет ресурсов Fred для обновления';
$_lang['fred.refresh_fail_template'] = 'Нет шаблонов Fred для обновления';
$_lang['fred.refresh_complete'] = 'Перестроение завершено';
$_lang['fred.refresh_id'] = 'Обновление идентификатора ресурса [[+id]]';

$_lang['fred.blueprints.page_title'] = 'Макеты';
$_lang['fred.blueprints.blueprints'] = 'Макеты';
$_lang['fred.blueprints.categories'] = 'Категории';
$_lang['fred.blueprints.none'] = 'Никаких макетов не найдено.';
$_lang['fred.blueprints.name'] = 'Имя';
$_lang['fred.blueprints.description'] = 'Описание';
$_lang['fred.blueprints.complete'] = 'Выполнено';
$_lang['fred.blueprints.public'] = 'Доступный';
$_lang['fred.blueprints.rank'] = 'Ранк';
$_lang['fred.blueprints.category'] = 'Категория';
$_lang['fred.blueprints.image'] = 'Изображение';
$_lang['fred.blueprints.created_by'] = 'Создано';
$_lang['fred.blueprints.category'] = 'Категория';
$_lang['fred.blueprints.search_name'] = 'Поиск по имени';
$_lang['fred.blueprints.remove'] = 'Удалить макет';
$_lang['fred.blueprints.remove_confirm'] = 'Вы уверены, что хотите удалить [[+name]] макет?';
$_lang['fred.blueprints.quick_update'] = 'Быстрое обновление макета';
$_lang['fred.blueprints.update'] = 'Обновление макета';
$_lang['fred.blueprints.create'] = 'Создание макета';

$_lang['fred.blueprint_cateogries.all'] = 'Все категории';
$_lang['fred.blueprint_categories.none'] = 'Категории не найдены.';
$_lang['fred.blueprint_categories.name'] = 'Имя';
$_lang['fred.blueprint_categories.public'] = 'Доступный';
$_lang['fred.blueprint_categories.rank'] = 'Ранк';
$_lang['fred.blueprint_categories.created_by'] = 'Создано';
$_lang['fred.blueprint_categories.search_name'] = 'Поиск по имени';
$_lang['fred.blueprint_categories.create'] = 'Создание категории';
$_lang['fred.blueprint_categories.update'] = 'Обновление категории';
$_lang['fred.blueprint_categories.remove'] = 'Удаление категории';
$_lang['fred.blueprint_categories.remove_confirm'] = 'Вы уверены, что хотите удалить "[[+name]]" категорию макетов и все [[+blueprints]] прикрепленные макеты?' ;
$_lang['fred.blueprint_categories.remove_confirm_singular'] = 'Вы уверены, что хотите удалить "[[+name]]" категорию макетов и [[+blueprints]] прикрепленные макеты?' ;
$_lang['fred.blueprint_categories.remove_confirm_empty'] = 'Вы уверены, что хотите удалить "[[+name]]" категорию макетов?' ;
$_lang['fred.blueprint_categories.number_of_blueprints'] = '# Макеты';

$_lang['setting_fred.launcher_position'] = 'Положение лаунчера';
$_lang['setting_fred.launcher_position_desc'] = 'Доступные значения: bottom_left, bottom_right, top_left, top_right';
$_lang['setting_fred.elements_category_id'] = 'Ид категорий элементов';
$_lang['setting_fred.elements_category_id_desc'] = 'Ид категории для использования в качестве источника элемента.';
$_lang['setting_fred.element_group_sort'] = 'Сортировка групп элементов';
$_lang['setting_fred.element_group_sort_desc'] = 'Здесь вы можете задать, как сортировать элементы: по имени или рангу';
$_lang['setting_fred.icon_editor'] = 'Редактор иконок';
$_lang['setting_fred.icon_editor_desc'] = 'Здесь вы можете задать, какой редактор будете импользовать для иконок';
$_lang['setting_fred.image_editor'] = 'Редактор изображений';
$_lang['setting_fred.image_editor_desc'] = 'Здесь вы можете задать, какой редактор будете импользовать для изображений';
$_lang['setting_fred.rte'] = 'Редактор';
$_lang['setting_fred.rte_desc'] = 'Здесь вы можете задать, какой редактор будете импользовать для редактивания';
$_lang['setting_fred.template_ids'] = 'IDs шаблонов';
$_lang['setting_fred.template_ids_desc'] = 'Список разделенных запятыми идентификаторов шаблонов, где Fred будет досупен.';
$_lang['setting_fred.default_element'] = 'Элемент по умолчанию';
$_lang['setting_fred.default_element_desc'] = 'Задайте идентификатор элемента <b>по умолчанию</b> и <b>цель</b> для преобразования ресурсов в Fred. Например: 13|content';
$_lang['setting_fred.blueprint_category_sort'] = 'Сортировка категорий макетов';
$_lang['setting_fred.blueprint_category_sort_desc'] = 'Сортировка категорий макетов по названию или рангу';
$_lang['setting_fred.blueprint_sort'] = 'Сортировка макетов';
$_lang['setting_fred.blueprint_sort_desc'] = 'Сортировка макетов по названию или рангу';


$_lang['fred.err.blueprint_categories_ns_name'] = 'Требуется имя';
$_lang['fred.err.bad_sort_column'] = 'Сортировка сетки по <strong>[[+column]]</strong> используя сортировку перетаскивания.';
$_lang['fred.err.clear_filter'] = 'Очистить фильтры для использования сортировки перетаскивания.';
$_lang['fred.err.required_filter'] = 'Вы должны фильтровать [[+filter]].';
